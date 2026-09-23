import { generatePayHereHash } from "../utils/payhere.js";

export async function generatePaymentHash(req,res){
    try{
        const {orderId} = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const amount = order.totalAmount;
    const currency = 'LKR';

    const hash = generatePayHereHash(merchantId, order._id.toString(), amount, currency, merchantSecret);

    res.json({
      merchantId,
      orderId: order._id.toString(),
      items: `Order #${order._id}`,
      amount: Number(amount).toFixed(2),
      currency,
      hash,

    //   Remember to change this acording to Order model
      customer: {
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        email: order.userEmail,
        phone: order.shippingAddress.phone,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        country: 'Sri Lanka'
      }
    });

    }
    catch(error){
        console.error('Error generating payment hash:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error
        });
    }
}


export async function handlePayHereNotification(req, res) {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      custom_1,
      method
    } = req.body;

    const isValid = verifyPayHereSignature(
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      process.env.PAYHERE_MERCHANT_SECRET,
      md5sig
    );

    if (!isValid) {
      console.error('Invalid PayHere Signature Warning');
      return res.status(400).send('Invalid signature');
    }

    const order = await Order.findById(order_id);
    if (!order) return res.status(404).send('Order not found');

    // Record or update transaction log
    await Payment.create({
      orderId: order._id,
      paymentId: payment_id,
      amount: payhere_amount,
      currency: payhere_currency,
      paymentMethod: method,
      statusCode: status_code,
      rawResponse: req.body
    });

    // Check payment status code (2 = Success)
    if (status_code === '2') {
      order.status = 'Paid';
      order.paidAt = new Date();
      await order.save();
    } else if (['0', '-1', '-2', '-3'].includes(status_code)) {
      order.status = 'Payment_Failed';
      await order.save();
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Server Error');
  }
};
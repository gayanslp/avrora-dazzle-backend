import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  paymentId: String, // PayHere reference
  amount: Number,
  currency: String,
  paymentMethod: String,
  statusCode: String,
  rawResponse: Object
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
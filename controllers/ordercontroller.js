import Order from '../models/ordermodel.js';
import Cart from '../models/cartmodel.js';
import mongoose from 'mongoose';

const createOrder = async (req,res) => {
    try {
        const {
            shippingAddress,
            coupon,
            paymentMethod,
        } = req.body;

        const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');

        if(!cart || cart.items.length === 0){
            return res.status(400).json({
                message: 'Cart is empty',
            });
        }
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            qty: item.qty,
            size: item.size,
            color: item.color,
        }));
        const itemsTotal = orderItems.reduce((total, item) => total + item.price * item.qty, 0);
        const discount = 0;
        const shipping = 0;

        const grandTotal = itemsTotal - discount + shipping;
        const order = new Order({
            user: req.user.userId,
            items: orderItems,
            shippingAddress,
            coupon: coupon || null,
            itemsTotal,
            discount,
            shipping,
            grandTotal,
            paymentMethod,
            status: 'pending',
        });
        await order.save();
        cart.items = [];
        await cart.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getOrderById = async (req, res) => {
    try{
        const {orderId} = req.params;

        if(!mongoose.Types.ObjectId.isValid(orderId)){
            return res.status(400).json({
                message: 'Invalid order ID',
            });
        }

        const order = await Order.findOne({
            _id: orderId,
            user: req.user.userId
        });
        if(!order){
            return res.status(404).json({
                message: 'Order not found',
            });
        }
        res.status(200).json(order);
    } catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};
const applyCoupon = async (req, res) => {
    try {
        const { code, orderTotal } = req.body;

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            active: true,
        });

        if (!coupon) {
            return res.status(404).json({
                message: 'Invalid or inactive coupon',
            });
        }

        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
            return res.status(400).json({
                message: 'Coupon has expired',
            });
        }

        if (orderTotal < coupon.minOrder) {
            return res.status(400).json({
                message: `Minimum order amount is ${coupon.minOrder}`,
            });
        }

        let discount = 0;

        if (coupon.type === 'percent') {
            discount = (orderTotal * coupon.value) / 100;
        } else if (coupon.type === 'fixed') {
            discount = coupon.value;
        }

        if (discount > orderTotal) {
            discount = orderTotal;
        }

        res.status(200).json({
            coupon: coupon._id,
            code: coupon.code,
            discount,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
export { createOrder, getMyOrders, getOrderById, applyCoupon };
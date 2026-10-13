import Order from '../models/ordermodel.js';
import Cart from '../models/cartmodel.js';
import Coupon from '../models/coupen.js';
import Setting from '../models/settingModel.js';
import mongoose from 'mongoose';

const createOrder = async (req,res) => {
    try {
        const {
            shippingAddress,
            coupon,
            paymentMethod,
            email
        } = req.body;

        const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');

        if(!cart || !Array.isArray(cart.items) || cart.items.length === 0){
            return res.status(400).json({
                message: 'Cart is empty',
            });
        }

        // Filter out any stale/deleted products
        const validItems = cart.items.filter(item => item && item.product && item.product._id);

        if (validItems.length === 0) {
            cart.items = [];
            await cart.save();
            return res.status(400).json({
                message: 'Your cart items are no longer available. Please select products again.',
            });
        }

        // If there were stale/deleted items in the cart, keep DB clean
        if (validItems.length !== cart.items.length) {
            cart.items = validItems;
            await cart.save();
        }

        const orderItems = validItems.map(item => ({
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            qty: item.qty,
            size: item.size,
            color: item.color,
        }));
        const itemsTotal = orderItems.reduce((total, item) => total + item.price * item.qty, 0);
        let discount = 0;
        let appliedCouponId = null;

        if (coupon) {
            const foundCoupon = mongoose.Types.ObjectId.isValid(coupon)
                ? await Coupon.findById(coupon)
                : await Coupon.findOne({ code: String(coupon).toUpperCase(), isActive: true });

            if (foundCoupon && (!foundCoupon.expiresAt || new Date(foundCoupon.expiresAt) >= new Date()) && itemsTotal >= (foundCoupon.minOrder || 0)) {
                appliedCouponId = foundCoupon._id;
                if (foundCoupon.type === 'percent') {
                    discount = (itemsTotal * foundCoupon.value) / 100;
                } else if (foundCoupon.type === 'fixed') {
                    discount = foundCoupon.value;
                }
                if (discount > itemsTotal) discount = itemsTotal;
            }
        }

        // Retrieve admin configured delivery fee from store settings
        const storeSettings = await Setting.findOne({ key: 'store_settings' });
        const shipping = storeSettings ? Number(storeSettings.deliveryFee) || 0 : 350;
        const grandTotal = Math.max(0, itemsTotal - discount + shipping);

        // COD is removed; only online payments like PayHere Gateway are accepted
        const sanitizedPaymentMethod = 'PayHere';

        const order = new Order({
            user: req.user.userId,
            userEmail: email || req.user.email,
            items: orderItems,
            shippingAddress,
            coupon: appliedCouponId,
            itemsTotal,
            discount,
            shipping,
            grandTotal,
            paymentMethod: sanitizedPaymentMethod,
            status: 'pending',
        });
        await order.save();
        cart.items = [];
        await cart.save();
        res.status(201).json(order._id);
    } catch (error) {
        console.error('Error creating order:', error);
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

        if (!code || typeof code !== 'string' || !code.trim()) {
            return res.status(400).json({
                message: 'Please enter a coupon code',
            });
        }

        const coupon = await Coupon.findOne({
            code: code.trim().toUpperCase(),
            isActive: true,
        });

        if (!coupon) {
            return res.status(404).json({
                message: 'Invalid or inactive coupon',
            });
        }

        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
            return res.status(400).json({
                message: 'Coupon has expired',
            });
        }

        const total = Number(orderTotal) || 0;
        if (coupon.minOrder && total < coupon.minOrder) {
            return res.status(400).json({
                message: `Minimum order amount is Rs ${coupon.minOrder.toLocaleString('en-IN')}`,
            });
        }

        let discount = 0;

        if (coupon.type === 'percent') {
            discount = (total * coupon.value) / 100;
        } else if (coupon.type === 'fixed') {
            discount = coupon.value;
        }

        if (discount > total) {
            discount = total;
        }

        res.status(200).json({
            coupon: coupon._id,
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            discount,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const { orderId } = req.params;
        const { status } = req.body;
        
        if(!mongoose.Types.ObjectId.isValid(orderId)){
            return res.status(400).json({ message: 'Invalid order ID' });
        }

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if(!order){
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createOrder, getMyOrders, getOrderById, applyCoupon, getAllOrders, updateOrderStatus };
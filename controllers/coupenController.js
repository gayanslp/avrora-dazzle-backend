import Coupon from '../models/coupen.js';
import mongoose from 'mongoose';

export const createCoupon = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        const { code, value, expiresAt, type, minOrder, isActive } = req.body;
        
        if (!code || !value || !expiresAt || !type) {
            return res.status(400).json({ message: 'Please provide all required fields (code, value, expiresAt, type).' });
        }

        const formattedCode = code.trim().toUpperCase();

        const existing = await Coupon.findOne({ code: formattedCode });
        if (existing) {
            return res.status(400).json({ message: `Coupon with code "${formattedCode}" already exists.` });
        }

        const newCoupon = new Coupon({
            code: formattedCode,
            value: Number(value),
            expiresAt: new Date(expiresAt),
            type,
            minOrder: Number(minOrder) || 0,
            isActive: isActive !== undefined ? Boolean(isActive) : true,
        });

        await newCoupon.save();
        res.status(201).json(newCoupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllCoupons = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCouponById = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        const { code } = req.params;
        const query = mongoose.Types.ObjectId.isValid(code) ? { _id: code } : { code: code.toUpperCase() };
        const coupon = await Coupon.findOne(query);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCoupon = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        const { code } = req.params;
        const query = mongoose.Types.ObjectId.isValid(code) ? { _id: code } : { code: code.toUpperCase() };

        const updateData = { ...req.body };
        if (updateData.code) {
            updateData.code = updateData.code.trim().toUpperCase();
        }
        if (updateData.value !== undefined) {
            updateData.value = Number(updateData.value);
        }
        if (updateData.minOrder !== undefined) {
            updateData.minOrder = Number(updateData.minOrder);
        }

        const updatedCoupon = await Coupon.findOneAndUpdate(query, updateData, { new: true });
        if (!updatedCoupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.status(200).json(updatedCoupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCoupon = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        const { code } = req.params;
        const query = mongoose.Types.ObjectId.isValid(code) ? { _id: code } : { code: code.toUpperCase() };
        const deletedCoupon = await Coupon.findOneAndDelete(query);
        if (!deletedCoupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


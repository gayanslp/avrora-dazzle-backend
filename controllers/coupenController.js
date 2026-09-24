import Coupon from '../models/coupen.js';

export const createCoupon = async (req, res) => {
    try {
        const { code, value, expiresAt, type, minOrder } = req.body;
        const newCoupen = new Coupon({ code, value, expiresAt, type, minOrder });
        await newCoupen.save();
        res.status(201).json(newCoupen);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllCoupons = async (req, res) => {
    try {
        const coupens = await Coupon.find();
        res.status(200).json(coupens);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCouponById = async (req, res) => {
    try {
        const { code } = req.params;
        const coupen = await Coupon.findOne({ code });
        if (!coupen) {
            return res.status(404).json({ message: 'Coupen not found' });
        }
        res.status(200).json(coupen);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const updatedCoupen = await Coupon.findOneAndUpdate({ code }, req.body, { returnDocument: 'after' });
        console.log('Updated Coupen:', updatedCoupen); 
        if (!updatedCoupen) {
            return res.status(404).json({ message: 'Coupen not found' });
        }
        res.status(200).json(updatedCoupen);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const deletedCoupen = await Coupon.findOneAndDelete({ code });
        if (!deletedCoupen) {
            return res.status(404).json({ message: 'Coupen not found' });
        }
        res.status(200).json({ message: 'Coupen deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


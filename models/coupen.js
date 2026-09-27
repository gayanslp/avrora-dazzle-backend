import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Number,
    required: true
  },
  type: {
      type: String,
      enum: ['percent', 'fixed'],
      required: [true, 'Coupon type is required'],
  },
  minOrder: {
      type: Number,
      default: 0,
      min: [0, 'Minimum order cannot be negative'],
  },
  expiresAt:{
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model('Coupon', couponSchema);
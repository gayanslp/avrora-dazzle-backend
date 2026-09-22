import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  otpHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // විනාඩි 5කට පසු Automatic Delete වේ (TTL Index)
  },
});

export default mongoose.model('Otp', otpSchema);
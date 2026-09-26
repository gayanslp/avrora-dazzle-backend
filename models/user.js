import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    address:
    {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      postalCode: String,
    },

  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
import mongoose from 'mongoose';

const mainCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String, 
      trim: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('MainCategory', mainCategorySchema);
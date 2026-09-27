import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
        category: { type: String },
        images: [{ type: String }],
        image: { type: String },
        color: { type: String },
        size: [{ type: String }],
        countInStock: { type: Number, default: 10 },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
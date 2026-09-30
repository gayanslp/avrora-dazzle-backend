import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        currency: {
            type: String,
            required: true,
            trim: true
        },
        colorLabel: {
            type: String,
            required: true,
            trim: true
        },
        images: [
            {
                type: String,
                trim: true
            }
        ],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MainCategory',
            required: true
        },
        subCategory: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Product", productSchema);
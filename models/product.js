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
            trim: true,
            default: 'Standard'
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory',
            required: true
        },
        size: [
            {
                type: String,
                trim: true
            }
        ],
        stock: {
            type: Number,
            default: 20
        },
        description: {
            type: String,
            trim: true
        },
        sale: {
            type: Boolean,
            default: false
        },
        originalPrice: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Product", productSchema);
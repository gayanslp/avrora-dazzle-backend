// Import mongoose to create the Product schema and model
import mongoose from "mongoose";

// Create schema for product reviews
const reviewSchema = new mongoose.Schema(
    {
        // Store the user who added the review
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Store the name of the reviewer
        name: {
            type: String,
            required: true
        },

        // Rating given by the user from 1 to 5
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        // Review comment
        comment: {
            type: String,
            required: true
        }
    },
    {
        // Automatically create createdAt and updatedAt
        timestamps: true
    }
);

// Create the main Product schema
const productSchema = new mongoose.Schema(
    {
        // Product name
        name: {
            type: String,
            required: true,
            trim: true
        },

        // Product description
        description: {
            type: String,
            required: true
        },

        // Product price
        price: {
            type: Number,
            required: true,
            min: 0
        },

        // Reference to the Category collection
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        // Product images
        images: [
            {
                type: String
            }
        ],

        // Available product sizes
        sizes: [
            {
                type: String
            }
        ],

        // Available product colors
        colors: [
            {
                type: String
            }
        ],

        // Available stock quantity
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        // Whether the product is a featured product
        featured: {
            type: Boolean,
            default: false
        },

        // Store product reviews inside the Product document
        reviews: [reviewSchema],

        // Average rating of the product
        ratingAvg: {
            type: Number,
            default: 0
        }
    },
    {
        // Automatically create createdAt and updatedAt
        timestamps: true
    }
);

// Export Product model
export default mongoose.model("Product", productSchema);
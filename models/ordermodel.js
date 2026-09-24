import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        qty: {
            type: Number,
            required: true,
            min: 1,
        },

        size: {
            type: String,
            required: true,
        },

        color: {
            type: String,
            required: true,
        },
    },
    {
        _id: true,
    }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
        },

        shippingAddress: {
            fullName: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true,
            },

            street: {
                type: String,
                required: true,
            },

            city: {
                type: String,
                required: true,
            },

            postalCode: {
                type: String,
                required: true,
            },
        },

        coupon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coupon',
            default: null,
        },

        itemsTotal: {
            type: Number,
            required: true,
            min: 0,
        },

        discount: {
            type: Number,
            default: 0,
            min: 0,
        },

        shipping: {
            type: Number,
            default: 0,
            min: 0,
        },

        grandTotal: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentMethod: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: [
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
            ],
            default: 'pending',
        },

        paidAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Order', orderSchema);
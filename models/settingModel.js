import mongoose from 'mongoose';

export const DEFAULT_HERO_SLIDES = [
    {
        image: '/hero_slide_gents_1.jpg',
        category: 'GENTS BESPOKE TAILORING',
        tagline: 'Tailored Luxury & Modern Sartorial Elegance',
        buttonText: 'Shop Gents Wear',
        link: '/products/mens',
        isActive: true,
    },
    {
        image: '/hero_slide_women_1.jpg',
        category: 'LADIES HAUTE COUTURE',
        tagline: 'Effortless Silhouettes & Contemporary Grace',
        buttonText: 'Shop Women Wear',
        link: '/products/women',
        isActive: true,
    },
    {
        image: '/hero_slide_gents_2.jpg',
        category: 'GENTS SMART CASUAL',
        tagline: 'Contemporary Knitwear & Tailored Trousers',
        buttonText: "Explore Men's Edit",
        link: '/products/mens',
        isActive: true,
    },
    {
        image: '/hero_slide_women_2.jpg',
        category: 'LADIES URBAN CHIC',
        tagline: 'Modern Denim & Premium Casual Luxury',
        buttonText: 'Shop Women Wear',
        link: '/products/women',
        isActive: true,
    },
    {
        image: '/hero_slide_gents_3.jpg',
        category: 'GENTS URBAN BESPOKE',
        tagline: 'Signature Overcoats & Elevated Masculine Style',
        buttonText: "Explore Men's Edit",
        link: '/products/mens',
        isActive: true,
    },
];

const heroSlideSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            default: 'NEW COLLECTION',
        },
        tagline: {
            type: String,
            default: 'Luxury & Modern Sartorial Elegance',
        },
        buttonText: {
            type: String,
            default: 'Shop Collection',
        },
        link: {
            type: String,
            default: '/products',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const settingSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            default: 'store_settings',
        },
        deliveryFee: {
            type: Number,
            required: true,
            default: 350,
            min: 0,
        },
        heroSlides: {
            type: [heroSlideSchema],
            default: DEFAULT_HERO_SLIDES,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Setting', settingSchema);

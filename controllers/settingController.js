import Setting, { DEFAULT_HERO_SLIDES } from '../models/settingModel.js';

export const getSettings = async (req, res) => {
    try {
        let setting = await Setting.findOne({ key: 'store_settings' });
        if (!setting) {
            setting = await Setting.create({
                key: 'store_settings',
                deliveryFee: 350,
                heroSlides: DEFAULT_HERO_SLIDES,
            });
        } else if (!setting.heroSlides || setting.heroSlides.length === 0) {
            setting.heroSlides = DEFAULT_HERO_SLIDES;
            await setting.save();
        }
        res.status(200).json({
            success: true,
            deliveryFee: setting.deliveryFee,
            heroSlides: setting.heroSlides,
            setting,
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch settings',
        });
    }
};

export const updateSettings = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden. Admin access required.',
            });
        }

        const { deliveryFee, heroSlides } = req.body;
        const updateFields = {};

        if (deliveryFee !== undefined && deliveryFee !== null) {
            if (isNaN(Number(deliveryFee)) || Number(deliveryFee) < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid non-negative delivery fee.',
                });
            }
            updateFields.deliveryFee = Number(deliveryFee);
        }

        if (heroSlides !== undefined) {
            if (!Array.isArray(heroSlides)) {
                return res.status(400).json({
                    success: false,
                    message: 'heroSlides must be an array.',
                });
            }
            updateFields.heroSlides = heroSlides;
        }

        const setting = await Setting.findOneAndUpdate(
            { key: 'store_settings' },
            { $set: updateFields },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            deliveryFee: setting.deliveryFee,
            heroSlides: setting.heroSlides,
            setting,
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update settings',
        });
    }
};

// GET /api/settings/hero-slides (Public)
export const getHeroSlides = async (req, res) => {
    try {
        let setting = await Setting.findOne({ key: 'store_settings' });
        if (!setting || !setting.heroSlides || setting.heroSlides.length === 0) {
            return res.status(200).json({
                success: true,
                slides: DEFAULT_HERO_SLIDES,
            });
        }

        res.status(200).json({
            success: true,
            slides: setting.heroSlides,
        });
    } catch (error) {
        console.error('Error fetching hero slides:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch hero slides',
        });
    }
};

// POST /api/settings/hero-slides (Admin only: Add new slide)
export const addHeroSlide = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden. Admin access required.',
            });
        }

        const { image, category, tagline, buttonText, link } = req.body;
        if (!image) {
            return res.status(400).json({
                success: false,
                message: 'Image is required for a hero slide.',
            });
        }

        let setting = await Setting.findOne({ key: 'store_settings' });
        if (!setting) {
            setting = await Setting.create({
                key: 'store_settings',
                deliveryFee: 350,
                heroSlides: DEFAULT_HERO_SLIDES,
            });
        }

        const newSlide = {
            image,
            category: category || 'EXCLUSIVE COLLECTION',
            tagline: tagline || 'Luxury & Elegance for Every Occasion',
            buttonText: buttonText || 'Shop Collection',
            link: link || '/products',
            isActive: true,
        };

        setting.heroSlides.push(newSlide);
        await setting.save();

        res.status(201).json({
            success: true,
            message: 'Hero slide added successfully',
            slides: setting.heroSlides,
            newSlide: setting.heroSlides[setting.heroSlides.length - 1],
        });
    } catch (error) {
        console.error('Error adding hero slide:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add hero slide',
        });
    }
};

// PUT /api/settings/hero-slides (Admin only: Save / update all slides)
export const updateHeroSlides = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden. Admin access required.',
            });
        }

        const { slides } = req.body;
        if (!Array.isArray(slides)) {
            return res.status(400).json({
                success: false,
                message: 'Slides must be an array.',
            });
        }

        const setting = await Setting.findOneAndUpdate(
            { key: 'store_settings' },
            { $set: { heroSlides: slides } },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: 'Hero slides updated successfully',
            slides: setting.heroSlides,
        });
    } catch (error) {
        console.error('Error updating hero slides:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update hero slides',
        });
    }
};

// DELETE /api/settings/hero-slides/:slideId (Admin only: Remove slide)
export const deleteHeroSlide = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden. Admin access required.',
            });
        }

        const { slideId } = req.params;
        let setting = await Setting.findOne({ key: 'store_settings' });
        if (!setting) {
            return res.status(404).json({
                success: false,
                message: 'Store settings not found.',
            });
        }

        setting.heroSlides = setting.heroSlides.filter(
            (slide) => slide._id && slide._id.toString() !== slideId
        );
        await setting.save();

        res.status(200).json({
            success: true,
            message: 'Hero slide removed successfully',
            slides: setting.heroSlides,
        });
    } catch (error) {
        console.error('Error deleting hero slide:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete hero slide',
        });
    }
};

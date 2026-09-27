import MainCategory from '../models/mainCategory.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await MainCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const { _id } = req.params;
        const category = await MainCategory.findById(_id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createCategory = async (req, res) => {
    try {
        if(req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can create categories.' });
        }
        const { name, slug, image } = req.body;
        const newCategory = new MainCategory({ name, slug, image });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateCategory = async (req, res) => {
    try {
        if(req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can update categories.' });
        }
        const { _id } = req.params;
        const updatedCategory = await MainCategory.findByIdAndUpdate(_id, req.body, { returnDocument: 'after' });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        if(req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can delete categories.' });
        }
        const { _id } = req.params;
        const deletedCategory = await MainCategory.findByIdAndDelete(_id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
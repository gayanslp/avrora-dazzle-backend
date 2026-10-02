import SubCategory from "../models/subCategory.js";

export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("mainCategory");
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate("mainCategory");
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSubCategory = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const subCategory = new SubCategory(req.body);
    await subCategory.save();
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" }).populate("mainCategory");
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    res.json({ message: "SubCategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
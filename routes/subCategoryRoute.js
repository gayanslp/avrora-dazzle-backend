import {getSubCategories, getSubCategoryById, createSubCategory, updateSubCategory, deleteSubCategory} from "../controllers/subCategoryController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const SubCategoryRouter = express.Router();

SubCategoryRouter.get("/", getSubCategories);
SubCategoryRouter.get("/:id", getSubCategoryById);
SubCategoryRouter.post("/", authMiddleware, createSubCategory);
SubCategoryRouter.put("/:id", authMiddleware, updateSubCategory);
SubCategoryRouter.delete("/:id", authMiddleware, deleteSubCategory);

export default SubCategoryRouter;
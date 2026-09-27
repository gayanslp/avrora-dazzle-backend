import express from "express"
import {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct
} from "../controllers/productcontroller.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/", createProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
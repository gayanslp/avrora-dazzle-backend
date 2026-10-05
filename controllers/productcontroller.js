import Product from "../models/product.js";

export async function getProducts(req, res) {
    try {
        const products = await Product.find()
            .populate('category')
            .populate('subCategory')
            .sort({ createdAt: -1, _id: -1 });
        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

export async function getProductById(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Get product error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


export async function createProduct(req, res) {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error("Create product error:", error);
        res.status(error.name === "ValidationError" || error.code === 11000 ? 400 : 500).json({
            success: false,
            message: error.name === "ValidationError" ? error.message :
                error.code === 11000 ? "SKU already exists" : "Server error"
        });
    }
}

export async function updateProduct(req, res) {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error("Update product error:", error);
        res.status(error.name === "ValidationError" || error.code === 11000 ? 400 : 500).json({
            success: false,
            message: error.name === "ValidationError" ? error.message :
                error.code === 11000 ? "SKU already exists" : "Server error"
        });
    }
}

export async function deleteProduct(req, res) {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}
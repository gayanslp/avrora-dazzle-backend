// Import Product model
import Product from "../models/product.js";


// Get all products
export async function getProducts(req, res) {
    try {
        // Get search, category, featured and sort values from URL
        const {
            search,
            category,
            featured,
            sort
        } = req.query;

        // Create an empty filter object
        let filter = {};

        // Search products by name
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter products by category
        if (category) {
            filter.category = category;
        }

        // Filter featured products
        if (featured !== undefined) {
            filter.featured = featured === "true";
        }

        // Find products and populate category details
        let query = Product.find(filter).populate("category");

        // Sort products by price, date or rating
        if (sort === "price_asc") {
            query = query.sort({ price: 1 });
        } else if (sort === "price_desc") {
            query = query.sort({ price: -1 });
        } else if (sort === "newest") {
            query = query.sort({ createdAt: -1 });
        } else if (sort === "rating") {
            query = query.sort({ ratingAvg: -1 });
        }

        // Execute the query
        const products = await query;

        // Send products to the client
        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        // Display error in the console
        console.error("Get products error:", error);

        // Send server error response
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// Get a single product by ID
export async function getProductById(req, res) {
    try {
        // Find product using the ID from the URL
        const product = await Product.findById(req.params.id)
            .populate("category");

        // Check whether product exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Send product details
        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        // Display error in console
        console.error("Get product error:", error);

        // Send server error response
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


// Create a new product
export async function createProduct(req, res) {
    try {
        // Create a new Product using request body data
        const product = new Product(req.body);

        // Save product to MongoDB
        await product.save();

        // Send success response
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        // Display error in console
        console.error("Create product error:", error);

        // Send server error response
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


// Update an existing product
export async function updateProduct(req, res) {
    try {
        // Find product by ID and update it
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        // Check whether product exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Send updated product
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        // Display error in console
        console.error("Update product error:", error);

        // Send server error response
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


// Delete a product
export async function deleteProduct(req, res) {
    try {
        // Find product by ID and delete it
        const product = await Product.findByIdAndDelete(req.params.id);

        // Check whether product exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Send success response
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        // Display error in console
        console.error("Delete product error:", error);

        // Send server error response
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


// Add a review to a product
export async function addReview(req, res) {
    try {
        // Get rating and comment from request body
        const { rating, comment } = req.body;

        // Check whether rating and comment are provided
        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "Rating and comment are required"
            });
        }

        // Find product using the product ID
        const product = await Product.findById(req.params.id);

        // Check whether product exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check whether the user already reviewed this product
        const alreadyReviewed = product.reviews.find(
            review => review.user.toString() === req.user._id.toString()
        );

        // Prevent duplicate reviews
        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            });
        }

        // Add the new review
        product.reviews.push({
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        });

        // Calculate total rating
        const totalRating = product.reviews.reduce(
            (total, review) => total + review.rating,
            0
        );

        // Calculate average rating
        product.ratingAvg =
            totalRating / product.reviews.length;

        // Save updated product
        await product.save();

        // Send success response
        res.status(201).json({
            success: true,
            message: "Review added successfully",
            product
        });

    } catch (error) {
        // Display error in console
        console.error("Add review error:", error);

        // Send server error response
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}
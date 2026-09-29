import Cart from '../models/cartmodel.js';
import User from '../models/user.js';

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
        if (!cart) {
            return res.status(200).json({
                items: [],
            });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
const addToCart = async (req, res) => {
    try {
        const { productId, qty, size, color } = req.body;
        let cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            cart = new Cart({
                user: req.user.userId,
                items: [{ product: productId, qty, size, color }],
            });
            await cart.save();
            return res.status(201).json(cart);
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId && item.size === size && item.color === color
        );
        if (existingItem) {
            existingItem.qty += qty;
        } else {
            cart.items.push({ product: productId, qty, size, color });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
const removeFromCart = async (req, res) => {
    try {
        const {itemId} = req.params;
        let cart = await Cart.findOne({ 
            user: req.user.userId
        });
        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found',
            });
        }
        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({
                message: 'Item not found in cart',
            });
        }
        item.deleteOne();
        await cart.save();
        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}
const mergeCart = async (req, res) => {
    try {
        const { items } = req.body; // array of items from frontend localStorage
        if (!items || !Array.isArray(items) || items.length === 0) {
            // Nothing to merge
            return res.status(200).json({ message: 'No items to merge' });
        }

        let cart = await Cart.findOne({ user: req.user.userId });
        
        if (!cart) {
            cart = new Cart({
                user: req.user.userId,
                items: items.map(item => ({
                    product: item.product,
                    qty: item.qty,
                    size: item.size,
                    color: item.color
                })),
            });
            await cart.save();
            return res.status(200).json(cart);
        }

        // Cart exists, let's merge
        for (const incomingItem of items) {
            const existingItem = cart.items.find(
                item => item.product.toString() === incomingItem.product && item.size === incomingItem.size && item.color === incomingItem.color
            );
            if (existingItem) {
                // If the item exists, we increase its quantity
                existingItem.qty += incomingItem.qty;
            } else {
                // Otherwise, add new item
                cart.items.push({
                    product: incomingItem.product,
                    qty: incomingItem.qty,
                    size: incomingItem.size,
                    color: incomingItem.color
                });
            }
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
const getWishlist = async (req, res) => {
    try{
        const user = await User.findById(req.user.userId).populate('wishlist');
        if(!user){
            return res.status(404).json({
                message: 'User not found',
            });
        }
        res.status(200).json(user.wishlist);
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
}
const toggleWishlist = async (req, res) => {
    try{
        const { productId } = req.params;
        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(404).json({
                message: 'User not found',
            });
        }
        const existingIndex = user.wishlist.findIndex(
            product => product.toString() === productId
        );
        if (existingIndex !== -1) {
            user.wishlist.splice(existingIndex, 1);
        } else {
            user.wishlist.push(productId);
        }
        await user.save();
        res.status(200).json({
            wishlist: user.wishlist,
        });

    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    };
};

export { getCart, addToCart, removeFromCart, getWishlist, toggleWishlist, mergeCart };
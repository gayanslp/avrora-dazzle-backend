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
        // Filter out items where the product was deleted
        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item && item.product != null);
        if (cart.items.length !== initialLength) {
            await cart.save();
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
        await cart.populate('items.product');
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        let cart = await Cart.findOne({
            user: req.user.userId
        });
        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found',
            });
        }
        // Filter out the item by _id or product id
        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item._id.toString() !== itemId && item.product.toString() !== itemId);
        
        if (cart.items.length === initialLength) {
            return res.status(404).json({
                message: 'Item not found in cart',
            });
        }
        
        await cart.save();
        await cart.populate('items.product');
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
        await cart.populate('items.product');
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateCartItemQuantity = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { qty } = req.body;
        
        let cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        const item = cart.items.find(i => i._id.toString() === itemId || i.product.toString() === itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        
        item.qty = qty;
        await cart.save();
        await cart.populate('items.product');
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        cart.items = [];
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('wishlist');
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }
        res.status(200).json(user.wishlist);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}
const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user.userId);
        if (!user) {
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

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    };
};

export { getCart, addToCart, removeFromCart, getWishlist, toggleWishlist, mergeCart, updateCartItemQuantity, clearCart };
import Cart from '../models/cartmodel.js';
import User from '../models/user.js';
import mongoose from 'mongoose';

const formatCart = (cartDoc) => {
    if (!cartDoc || !cartDoc.items) {
        return { _id: cartDoc?._id || null, items: [] };
    }
    const formattedItems = cartDoc.items.map(item => {
        const prod = (item.product && typeof item.product === 'object') ? item.product : {};
        return {
            id: item._id ? item._id.toString() : item.id,
            itemId: item._id ? item._id.toString() : item.id,
            productId: prod._id ? prod._id.toString() : (item.product ? item.product.toString() : null),
            name: item.name || prod.name || 'Product Item',
            price: item.price !== undefined && item.price !== null ? item.price : (prod.price || 0),
            currency: item.currency || 'Rs ',
            quantity: item.qty || 1,
            qty: item.qty || 1,
            size: item.size || 'Standard',
            color: item.color || 'Standard',
            variant: `${item.color || ''} / ${item.size || ''}`.trim().replace(/^[\/\s]+|[\/\s]+$/g, ''),
            image: item.image || (prod.images && prod.images[0]) || prod.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000'
        };
    });
    return {
        _id: cartDoc._id,
        user: cartDoc.user,
        items: formattedItems
    };
};

const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
        if (!cart) {
            return res.status(200).json({ items: [] });
        }
        res.status(200).json(formatCart(cart));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, qty, size, color, name, price, image, currency } = req.body;
        const addQty = parseInt(qty, 10) || 1;
        
        let cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            cart = new Cart({
                user: req.user.userId,
                items: []
            });
        }

        const validProductId = (productId && mongoose.Types.ObjectId.isValid(productId)) ? productId : null;

        const existingItem = cart.items.find(item => {
            const matchesId = validProductId && item.product && item.product.toString() === validProductId.toString();
            const matchesName = name && item.name && item.name === name;
            return (matchesId || matchesName) && item.size === size && item.color === color;
        });

        if (existingItem) {
            existingItem.qty += addQty;
            if (name) existingItem.name = name;
            if (price !== undefined) existingItem.price = price;
            if (image) existingItem.image = image;
        } else {
            cart.items.push({
                product: validProductId,
                qty: addQty,
                size: size || 'Standard',
                color: color || 'Standard',
                name: name || 'Product Item',
                price: price || 0,
                image: image || '',
                currency: currency || 'Rs '
            });
        }

        await cart.save();
        await cart.populate('items.product');
        res.status(200).json(formatCart(cart));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCartItemQty = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { qty } = req.body;
        const newQty = parseInt(qty, 10);

        let cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            const itemIndex = cart.items.findIndex(i => i._id.toString() === itemId);
            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }
            if (newQty <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].qty = newQty;
            }
        } else {
            if (newQty <= 0) {
                item.deleteOne();
            } else {
                item.qty = newQty;
            }
        }

        await cart.save();
        await cart.populate('items.product');
        res.status(200).json(formatCart(cart));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        let cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.id(itemId);
        if (item) {
            item.deleteOne();
        } else {
            const itemIndex = cart.items.findIndex(i => i._id.toString() === itemId);
            if (itemIndex !== -1) {
                cart.items.splice(itemIndex, 1);
            }
        }

        await cart.save();
        await cart.populate('items.product');
        res.status(200).json(formatCart(cart));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.status(200).json({ items: [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('wishlist');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
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
        res.status(200).json({ wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getCart, addToCart, updateCartItemQty, removeFromCart, clearCart, getWishlist, toggleWishlist };

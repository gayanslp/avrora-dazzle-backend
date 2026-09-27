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
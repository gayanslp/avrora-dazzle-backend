import Cart from '../models/cartmodel.js';

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({
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

export { getCart };
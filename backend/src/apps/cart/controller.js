import {
    getCart as getCartService,
    addToCart as addToCartService,
    updateCartItem as updateCartItemService,
    removeFromCart as removeFromCartService,
    clearCart as clearCartService
} from "./services/cart.js";

export const getCart = async (req, res) => {

  const userId = 1;
    try {
        const cart = await getCartService(userId);

        return res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve cart"
        });
    }
};

export const addToCart = async (req, res) => {
  const userId = 1;

    try {
        const { productId, quantity } = req.body;

        const cartItem = await addToCartService({
            userId: userId,
            productId,
            quantity
        });

        return res.status(201).json({
            success: true,
            message: "Product added to cart",
            cartItem
        });

    } catch (error) {
        console.error(error);

        const clientErrors = [
            "Product not found",
            "Product is not available",
            "Insufficient stock",
            "Requested quantity exceeds available stock",
            "Quantity must be at least 1"
        ];

        const status = clientErrors.includes(error.message)
            ? 400
            : 500;

        return res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

export const updateCartItem = async (req, res) => {
  const userId = 1;

    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        const cartItem = await updateCartItemService({
            userId: userId,
            itemId,
            quantity
        });

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cartItem
        });

    } catch (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const removeFromCart = async (req, res) => {
  const userId = 1;

    try {
        const { itemId } = req.params;

        await removeFromCartService({
            userId: userId,
            itemId
        });

        return res.status(200).json({
            success: true,
            message: "Item removed from cart"
        });

    } catch (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const clearCart = async (req, res) => {
  const userId = 1;

    try {
        await clearCartService(userId);

        return res.status(200).json({
            success: true,
            message: "Cart cleared"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to clear cart"
        });
    }
};

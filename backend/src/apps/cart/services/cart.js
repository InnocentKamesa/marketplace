import { Cart, CartItem} from "../../../models/cart.js";
import { products } from "../../../models/products.js";

/**
 * Get the user's cart
 */
export const getCart = async (userId) => {
    let cart = await Cart.findOne({
        where: { userId },
        include: [
            {
                model: CartItem,
                as: "items",
                include: [
                    {
                        model: products,
                        as: "product",
                    },
                ],
            },
        ],
    });

    // Create a cart if the user doesn't have one yet
    if (!cart) {
        cart = await Cart.create({ userId });

        cart.items = [];
    }

    return cart;
};


/**
 * Add a product to the cart
 */
export const addToCart = async ({
    userId,
    productId,
    quantity = 1,
}) => {
    if (quantity < 1) {
        throw new Error("Quantity must be at least 1");
    }

    // Make sure the product exists
    const product = await products.findByPk(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    // Don't allow unavailable products
    if (product.status !== "available") {
        throw new Error("Product is not available");
    }

    // Don't allow more than available stock
    if (quantity > product.stockQTY) {
        throw new Error("Requested quantity exceeds available stock");
    }

    // Find user's cart or create it
    const [cart] = await Cart.findOrCreate({
        where: { userId },
        defaults: { userId },
    });

    // Check if product is already in cart
    const existingItem = await CartItem.findOne({
        where: {
            cartId: cart.id,
            productId,
        },
    });

    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > product.stockQTY) {
            throw new Error("Requested quantity exceeds available stock");
        }

        existingItem.quantity = newQuantity;
        await existingItem.save();

        return existingItem;
    }

    // Product isn't in cart yet
    return await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
    });
};


/**
 * Update the quantity of an existing cart item
 */
export const updateCartItem = async ({
    userId,
    itemId,
    quantity,
}) => {
    if (quantity < 1) {
        throw new Error("Quantity must be at least 1");
    }

    // Find the user's cart
    const cart = await Cart.findOne({
        where: { userId },
    });

    if (!cart) {
        throw new Error("Cart not found");
    }

    // Find item belonging specifically to this cart
    const cartItem = await CartItem.findOne({
        where: {
            id: itemId,
            cartId: cart.id,
        },
        include: [
            {
                model: products,
                as: "product",
            },
        ],
    });

    if (!cartItem) {
        throw new Error("Cart item not found");
    }

    if (cartItem.product.status !== "available") {
        throw new Error("Product is no longer available");
    }

    if (quantity > cartItem.product.stockQTY) {
        throw new Error("Requested quantity exceeds available stock");
    }

    cartItem.quantity = quantity;

    await cartItem.save();

    return cartItem;
};


/**
 * Remove one item from the cart
 */
export const removeFromCart = async ({
    userId,
    itemId,
}) => {
    const cart = await Cart.findOne({
        where: { userId },
    });

    if (!cart) {
        throw new Error("Cart not found");
    }

    const cartItem = await CartItem.findOne({
        where: {
            id: itemId,
            cartId: cart.id,
        },
    });

    if (!cartItem) {
        throw new Error("Cart item not found");
    }

    await cartItem.destroy();

    return {
        message: "Item removed from cart",
    };
};


/**
 * Remove all items from the cart
 */
export const clearCart = async (userId) => {
    const cart = await Cart.findOne({
        where: { userId },
    });

    if (!cart) {
        return {
            message: "Cart is already empty",
        };
    }

    await CartItem.destroy({
        where: {
            cartId: cart.id,
        },
    });

    return {
        message: "Cart cleared",
    };
};

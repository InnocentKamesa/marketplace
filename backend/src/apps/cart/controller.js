import {
    getCart as getCartService,
    addToCart as addToCartService,
    updateCartItem as updateCartItemService,
    removeFromCart as removeFromCartService,
    clearCart as clearCartService,
    syncCartItemsOnCheckout
} from "./services/cart.js";

export const getCart = async (req, res) => {

  const userId = req.user.id || null;

  if(!userId){
    return res.status(400).json({message:"Failed to retreive user id"})
  }

    try {
        const cart = await getCartService(userId);

        return res.status(200).json({
            success: true,
            data:cart
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
    const { productId, quantity } = req.body;
    console.log(req.user)
    const userId = req.user.id;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: `productId and quantity is required: ${productId}, ${quantity}`,
      });
    }


    try {
        

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
  const userId = 6;

  if(!userId){
    return res.ststus(400).json({message:"User id required"})
  }

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
  const userId =  req.user.id;

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

export const syncCart = async(req, res, next) => {
    const updates = req.body;
    const userId = req.user.id;

    if(!data){
        return res.status(400).json({message:"Expected product updates"})
    }

    try {
        const response = await syncCartItemsOnCheckout(userId, updates); 

        if(response.success === false){
            return res.status(500).json({message:response.message})
        }
        return res.status(200).json({message:response.message, data:response.data})
    }
    catch (error){
        next(error)
    }
}
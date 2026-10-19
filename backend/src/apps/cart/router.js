import express from "express";

import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from "./controller.js";

import { authenticate } from "../auth/middleware.js";

const cartRouter = express.Router();

// router.use(authenticate);

cartRouter.get("/", authenticate, getCart);

cartRouter.post("/items/", authenticate, addToCart);

cartRouter.patch(
    "/items/:itemId",
    updateCartItem
);

cartRouter.delete(
    "/items/:itemId",
    authenticate,
    removeFromCart
);

cartRouter.delete("/", authenticate, clearCart);

export default cartRouter;

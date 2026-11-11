import express from "express";
import {authenticate} from "../auth/middleware.js";

import {
    checkout,
    buyNow,
    getMyOrders,
    getOrder,
    initializePayment,
    confirmPayChanguPayment,
    verifyPaymentOtp,
    changeOrderStatus,
    getSellerOrders
} from "./controller.js";

const orderRouter = express.Router();

orderRouter.post("/checkout/", authenticate, checkout);
orderRouter.post("/buy-now/", buyNow);
orderRouter.get("/my-orders/", getMyOrders);
orderRouter.get("/seller/my-orders/", getSellerOrders);
orderRouter.post("/:id/pay/", initializePayment);
orderRouter.post("/:id/pay/changu/confirm/", confirmPayChanguPayment);
orderRouter.post("/:id/pay/changu/otp/verify/", verifyPaymentOtp);
orderRouter.patch("/:id/status/", changeOrderStatus);
orderRouter.get("/:id/", getOrder);

export default orderRouter;

import express from "express";

import {
    checkout,
    buyNow,
    getMyOrders,
    getOrder,
    initializePayment,
    confirmPayChanguPayment,
    verifyPaymentOtp,
    changeOrderStatus,
} from "./controller.js";

const orderRouter = express.Router();

orderRouter.post("/checkout/", checkout);
orderRouter.post("/buy-now/", buyNow);
orderRouter.get("/my-orders/", getMyOrders);
orderRouter.post("/:id/pay/changu/", initializePayment);
orderRouter.post("/:id/pay/changu/confirm/", confirmPayChanguPayment);
orderRouter.post("/:id/pay/changu/otp/verify/", verifyPaymentOtp);
orderRouter.patch("/:id/status/", changeOrderStatus);
orderRouter.get("/:id/", getOrder);

export default orderRouter;

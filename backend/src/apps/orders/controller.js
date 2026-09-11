import {
    getOrderById,
    getUserOrders,
    createOrderFromCart,
    createBuyNowOrder,
    createPaymentLink,
    confirmPayment,
    verifyOrderOtp,
    updateOrderStatus,
} from "./services/orders.js";


export const checkout = async (req, res) => {
    const userId = 1;

    try {
        const { shippingAddress, notes, paymentMethod } = req.body;

        //create order
        const orderData = await createOrderFromCart({
            userId,
            shippingAddress,
            notes,
            paymentMethod,
        });


        //return
        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            tx_ref:tx_ref,
            order: orderData,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const buyNow = async (req, res) => {
    const userId = 1;

    try {
        const { productId, quantity, shippingAddress, notes, paymentMethod } = req.body;

        const orderData = await createBuyNowOrder({
            userId,
            productId,
            quantity,
            shippingAddress,
            notes,
            paymentMethod,
        });

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: orderData,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMyOrders = async (req, res) => {
    const userId = 1;

    try {
        const orders = await getUserOrders(userId);

        return res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getOrder = async (req, res) => {
    const userId = 1;

    try {
        const { id } = req.params;

        const orderData = await getOrderById(id, userId);

        return res.status(200).json({
            success: true,
            order: orderData,
        });
    } catch (error) {
        const status = error.message === "Order not found" ? 404 : 400;

        return res.status(status).json({
            success: false,
            message: error.message,
        });
    }
};

export const initializePayment = async (req, res) => {
    const userId = 1;

    try {
        const { id } = req.params;

        const paymentResponse = await createPaymentLink({
            orderId: id,
            userId,
        });

        return res.status(200).json(paymentResponse);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const confirmPayChanguPayment = async (req, res) => {
    const userId = 1;

    try {
        const { id } = req.params;
        const { reference, amount, currency } = req.body;

        const paymentResult = await confirmPayment({
            orderId: id,
            userId,
            reference,
            amount,
            currency,
        });

        return res.status(200).json({
            success: true,
            message: "Payment confirmed successfully",
            otpCode: paymentResult.otpCode,
            order: paymentResult.order,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const verifyPaymentOtp = async (req, res) => {
    const userId = 1;

    try {
        const { id } = req.params;
        const { otpCode } = req.body;

        const orderData = await verifyOrderOtp({
            orderId: id,
            userId,
            otpCode,
        });

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            order: orderData,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const changeOrderStatus = async (req, res) => {
    const userId = 1;

    try {
        const { id } = req.params;
        const { status } = req.body;

        const orderData = await updateOrderStatus({
            orderId: id,
            userId,
            status,
        });

        return res.status(200).json({
            success: true,
            message: "Order status updated",
            order: orderData,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

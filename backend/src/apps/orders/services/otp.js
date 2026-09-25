export const verifyOrderOtp = async ({ orderId, userId, otpCode }) => {
    if (!otpCode) {
        throw new Error("OTP code is required");
    }

    const orderData = await getOrderById(orderId, userId);

    if (orderData.paymentStatus !== "paid") {
        throw new Error("Payment must be successful before OTP verification");
    }

    if (!orderData.otpCodeHash || !orderData.otpExpiresAt) {
        throw new Error("No OTP has been generated for this order");
    }

    if (new Date() > new Date(orderData.otpExpiresAt)) {
        throw new Error("OTP has expired");
    }

    const isValidOtp = await bcrypt.compare(String(otpCode), orderData.otpCodeHash);

    if (!isValidOtp) {
        throw new Error("Invalid OTP");
    }

    await orderData.update({
        otpVerifiedAt: new Date(),
        status: "processing",
    });

    return await getOrderById(orderId, userId);
};



import bcrypt from "bcryptjs";
import { Cart, CartItem } from "../../../models/cart.js";
import { products } from "../../../models/products.js";
import { order, OrderItem } from "../../../models/orders.js";
import { verifyPayChanguTransaction } from "./paychangu.js";

const generateOrderNumber = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
};

export const generateOrderOtp = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
};


const buildPayChanguReference = (orderData) => {
    if (orderData.payChanguReference) {
        return orderData.payChanguReference;
    }

    return `paychangu_${orderData.orderNumber}_${Date.now()}`;
};


export const getOrderById = async (orderId, buyerId = null) => {
    const where = buyerId ? { id: orderId, buyerId } : { id: orderId };

    const orderData = await order.findOne({
        where,
        include: [
            {
                model: OrderItem,
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

    if (!orderData) {
        throw new Error("Order not found");
    }

    return orderData;
};

export const getUserOrders = async (userId) => {
    return await order.findAll({
        where: { buyerId: userId },
        include: [
            {
                model: OrderItem,
                as: "items",
                include: [
                    {
                        model: products,
                        as: "product",
                    },
                ],
            },
        ],
        order: [["createdAt", "DESC"]],
    });
};

export const createOrderFromCart = async ({
    userId,
    shippingAddress,
    notes,
    paymentMethod = "paychangu",
}) => {
    if (!userId) {
        throw new Error("User is required");
    }

    if (!shippingAddress || !shippingAddress.trim()) {
        throw new Error("Shipping address is required");
    }

    const cart = await Cart.findOne({
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

    if (!cart || !cart.items || cart.items.length === 0) {
        throw new Error("Cart is empty");
    }

    let subtotal = 0;
    const itemsToCreate = [];

    for (const item of cart.items) {
        const product = item.product;

        if (!product) {
            throw new Error("Product no longer exists");
        }

        if (product.status !== "available") {
            throw new Error(`Product "${product.title}" is not available`);
        }

        if (item.quantity > product.stockQTY) {
            throw new Error(`Requested quantity exceeds stock for "${product.title}"`);
        }

        const unitPrice = Number(product.price);
        const lineTotal = unitPrice * item.quantity;

        subtotal += lineTotal;

        itemsToCreate.push({
            productId: product.id,
            sellerId: product.sellerId || userId,
            quantity: item.quantity,
            unitPrice: unitPrice.toFixed(2),
            subtotal: Number(lineTotal.toFixed(2)),
            fulfillmentStatus: "pending",
        });
    }

    const deliveryFee = 0;
    const totalAmount = Number((subtotal + deliveryFee).toFixed(2));

    const newOrder = await order.create({
        buyerId: userId,
        orderNumber: generateOrderNumber(),
        status: "pending",
        paymentStatus: "pending",
        paymentMethod,
        subtotal: Number(subtotal.toFixed(2)),
        deliveryFee: Number(deliveryFee.toFixed(2)),
        totalAmount,
        shippingAddress: shippingAddress.trim(),
        notes: notes || null,
        placedAt: new Date(),
    });

    await Promise.all(
        itemsToCreate.map((item) =>
            OrderItem.create({
                ...item,
                orderId: newOrder.id,
            })
        )
    );

    await CartItem.destroy({
        where: {
            cartId: cart.id,
        },
    });

    return await getOrderById(newOrder.id, userId);
};

export const createBuyNowOrder = async ({
    userId,
    productId,
    quantity = 1,
    shippingAddress,
    notes,
    paymentMethod = "paychangu",
}) => {
    if (!userId) {
        throw new Error("User is required");
    }

    if (!productId) {
        throw new Error("Product is required");
    }

    if (!shippingAddress || !shippingAddress.trim()) {
        throw new Error("Shipping address is required");
    }

    if (quantity < 1) {
        throw new Error("Quantity must be at least 1");
    }

    const product = await products.findByPk(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    if (product.status !== "available") {
        throw new Error("Product is not available");
    }

    if (quantity > product.stockQTY) {
        throw new Error("Requested quantity exceeds available stock");
    }

    const unitPrice = Number(product.price);
    const subtotal = Number((unitPrice * quantity).toFixed(2));
    const deliveryFee = 0;
    const totalAmount = Number((subtotal + deliveryFee).toFixed(2));

    const newOrder = await order.create({
        buyerId: userId,
        orderNumber: generateOrderNumber(),
        status: "pending",
        paymentStatus: "pending",
        paymentMethod,
        subtotal,
        deliveryFee,
        totalAmount,
        shippingAddress: shippingAddress.trim(),
        notes: notes || null,
        placedAt: new Date(),
    });

    await OrderItem.create({
        orderId: newOrder.id,
        productId: product.id,
        sellerId: product.sellerId || userId,
        quantity,
        unitPrice: unitPrice.toFixed(2),
        subtotal,
        fulfillmentStatus: "pending",
    });

    return await getOrderById(newOrder.id, userId);
};

export const createPaymentLink = async ({ orderId, userId }) => {
    const orderData = await getOrderById(orderId, userId);
    const paymentReference = buildPayChanguReference(orderData);

    if (!orderData.payChanguReference) {
        await orderData.update({
            payChanguReference: paymentReference,
        });
    }

    if (orderData.paymentStatus === "paid") {
        return {
            success: true,
            message: "Order already paid",
            orderId: orderData.id,
            paymentStatus: orderData.paymentStatus,
            paymentReference: paymentReference,
            paymentLink: `${process.env.PAYCHANGU_CHECKOUT_URL || "https://checkout.paychangu.com"}/pay/${paymentReference}?amount=${orderData.totalAmount}`,
        };
    }

    return {
        success: true,
        message: "PayChangu payment initialized",
        orderId: orderData.id,
        paymentStatus: orderData.paymentStatus,
        paymentReference: paymentReference,
        paymentLink: `${process.env.PAYCHANGU_CHECKOUT_URL || "https://checkout.paychangu.com"}/pay/${paymentReference}?amount=${orderData.totalAmount}`,
    };
};

export const confirmPayment = async ({ orderId, userId, reference, amount, currency = "MKW" }) => {
    const orderData = await getOrderById(orderId, userId);
    const transactionReference = reference || orderData.payChanguReference || buildPayChanguReference(orderData);
    const verification = await verifyPayChanguTransaction({
        reference: transactionReference,
        amount: amount || orderData.totalAmount,
        currency,
    });

    if (!verification.success) {
        await orderData.update({
            payChanguReference: transactionReference,
            paymentStatus: "failed",
            status: "pending",
            payChanguStatus: verification.status || "failed",
        });

        throw new Error("PayChangu payment verification failed");
    }

    const otpCode = generateOrderOtp();
    const otpHash = await bcrypt.hash(otpCode, 10);

    await orderData.update({
        payChanguReference: transactionReference,
        paymentStatus: "paid",
        status: "paid",
        payChanguStatus: verification.status,
        paymentVerifiedAt: new Date(),
        otpCodeHash: otpHash,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        otpVerifiedAt: null,
    });

    const orderItems = await OrderItem.findAll({
        where: { orderId: orderData.id },
    });

    await Promise.all(
        orderItems.map(async (item) => {
            const productData = await products.findByPk(item.productId);

            if (!productData) {
                return;
            }

            const updatedStock = Number(productData.stockQTY || 0) - Number(item.quantity);
            const nextStatus = updatedStock <= 0 ? "sold" : "available";

            await productData.update({
                stockQTY: Math.max(updatedStock, 0),
                status: nextStatus,
            });
        })
    );

    return {
        otpCode,
        order: await getOrderById(orderId, userId),
    };
};

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

export const updateOrderStatus = async ({
    orderId,
    userId,
    status,
}) => {
    if (!status) {
        throw new Error("Status is required");
    }

    const orderData = await getOrderById(orderId, userId);

    const validStatuses = [
        "pending",
        "paid",
        "processing",
        "delivered",
        "cancelled",
        "refunded",
    ];

    if (!validStatuses.includes(status)) {
        throw new Error("Invalid order status");
    }

    await orderData.update({
        status,
        ...(status === "delivered" ? { deliveredAt: new Date() } : {}),
        ...(status === "cancelled" ? { cancelledAt: new Date() } : {}),
    });

    return await getOrderById(orderId, userId);
};

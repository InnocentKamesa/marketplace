import { Cart, CartItem } from "../../../models/cart.js";
import { products } from "../../../models/products.js";
import { order, OrderItem } from "../../../models/orders.js";

const generateOrderNumber = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
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

    if (orderData.paymentStatus === "paid") {
        return {
            success: true,
            message: "Order already paid",
            orderId: orderData.id,
            paymentStatus: orderData.paymentStatus,
            paymentLink: `https://checkout.paychangu.test/pay/${orderData.orderNumber}`,
        };
    }

    return {
        success: true,
        message: "PayChangu payment initialized",
        orderId: orderData.id,
        paymentStatus: orderData.paymentStatus,
        paymentLink: `https://checkout.paychangu.test/pay/${orderData.orderNumber}?amount=${orderData.totalAmount}`,
    };
};

export const confirmPayment = async ({ orderId, userId }) => {
    const orderData = await getOrderById(orderId, userId);

    await orderData.update({
        paymentStatus: "paid",
        status: "paid",
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

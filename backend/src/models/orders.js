import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Users from "./user.js";
import { products } from "./products.js";

export const order = sequelize.define(
    "order",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        buyerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        orderNumber: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },

        status: {
            type: DataTypes.ENUM(
                "pending",
                "paid",
                "processing",
                "delivered",
                "cancelled",
                "refunded"
            ),
            allowNull: false,
            defaultValue: "pending",
        },

        paymentStatus: {
            type: DataTypes.ENUM(
                "pending",
                "paid",
                "failed",
                "refunded"
            ),
            allowNull: false,
            defaultValue: "pending",
        },

        paymentMethod: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },

        payChanguReference: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: true,
        },

        payChanguStatus: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },

        paymentVerifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        otpCodeHash: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },

        otpExpiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        otpVerifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        subtotal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },

        deliveryFee: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },

        totalAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },

        shippingAddress: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        placedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        deliveredAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        cancelledAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "orders",
        timestamps: true,
        indexes: [
            {
                fields: ["buyerId"],
            },
            {
                fields: ["status"],
            },
            {
                fields: ["paymentStatus"],
            },
            {
                fields: ["createdAt"],
            },
        ],
    }
);

export const OrderItem = sequelize.define(
    "OrderItem",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        sellerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },

        unitPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },

        subtotal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },

        fulfillmentStatus: {
            type: DataTypes.ENUM(
                "pending",
                "processing",
                "delivered",
                "cancelled",
                "refunded"
            ),
            allowNull: false,
            defaultValue: "pending",
        },
    },
    {
        tableName: "order_items",
        timestamps: true,
        indexes: [
            {
                fields: ["orderId"],
            },
            {
                fields: ["productId"],
            },
            {
                fields: ["sellerId"],
            },
        ],
    }
);

Users.hasMany(order, {
    foreignKey: "buyerId",
    as: "orders",
    onDelete: "CASCADE",
});

order.belongsTo(Users, {
    foreignKey: "buyerId",
    as: "buyer",
});

order.hasMany(OrderItem, {
    foreignKey: "orderId",
    as: "items",
    onDelete: "CASCADE",
});

OrderItem.belongsTo(order, {
    foreignKey: "orderId",
    as: "order",
});

products.hasMany(OrderItem, {
    foreignKey: "productId",
    as: "orderItems",
    onDelete: "RESTRICT",
});

OrderItem.belongsTo(products, {
    foreignKey: "productId",
    as: "product",
});



import { DataTypes } from "sequelize";
import sequelize from "../config/db";
import Users from "./user";


export const order = sequelize.define(
    "order",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        buyerId: {
            type: DataTypes.UUID,
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
                "confirmed",
                "processing",
                "shipped",
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
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        orderId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        productId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        sellerId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },

        // Price when the order was placed
        unitPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },

        // quantity * unitPrice
        subtotal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },

        fulfillmentStatus: {
            type: DataTypes.ENUM(
                "pending",
                "processing",
                "shipped",
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



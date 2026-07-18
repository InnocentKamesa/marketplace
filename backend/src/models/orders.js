import { DataTypes } from "sequelize";
import sequelize from "../config/db";
import Users from "./user";
import { Listings } from "./listing";

const Orders = sequelize.define("Orders", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    buyer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: "id"
        }
    },
    seller_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: "id"
        }
    },
    listing_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Listings,
            key: "id"
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending", "confirmed", "processing", "delivered", "cancelled", "disputed"),
        allowNull: false,
        defaultValue: "pending"
    },
    delivery_mode: {
        type: DataTypes.ENUM("pickup", "delivery"),
        allowNull: false,
        defaultValue: "pickup"
    },
    otp_code_hash: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    otp_expires_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    otp_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: "orders"
});

const OrderStatusHistory = sequelize.define("OrderStatusHistory", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Orders,
            key: "id"
        }
    },
    from_status: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    to_status: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    actor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Users,
            key: "id"
        }
    },
    note: {
        type: DataTypes.STRING(500),
        allowNull: true
    }
}, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: "order_status_history",
    createdAt: "created_at",
    updatedAt: false
});

Orders.belongsTo(Users, { foreignKey: "buyer_id", as: "buyer" });
Orders.belongsTo(Users, { foreignKey: "seller_id", as: "seller" });
Orders.belongsTo(Listings, { foreignKey: "listing_id" });

Users.hasMany(Orders, { foreignKey: "buyer_id", as: "purchases" });
Users.hasMany(Orders, { foreignKey: "seller_id", as: "sales" });
Listings.hasMany(Orders, { foreignKey: "listing_id" });

Orders.hasMany(OrderStatusHistory, { foreignKey: "order_id", onDelete: "CASCADE" });
OrderStatusHistory.belongsTo(Orders, { foreignKey: "order_id" });
OrderStatusHistory.belongsTo(Users, { foreignKey: "actor_id", as: "actor" });
Users.hasMany(OrderStatusHistory, { foreignKey: "actor_id", as: "actions" });

module.exports = { Orders, OrderStatusHistory };
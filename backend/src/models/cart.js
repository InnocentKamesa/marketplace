import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const Cart = sequelize.define(
        "Cart",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey: true,
            },

            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "carts",
            timestamps: true,
        }
    );


export const CartItem = sequelize.define(
        "CartItem",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey: true,
            },

            cartId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,

                validate: {
                    min: 1,
                },
            },
        },
        {
            tableName: "cart_items",
            timestamps: true,

            indexes: [
                {
                    unique: true,
                    fields: ["cartId", "productId"],
                },
            ],
        }
    );

import Users from "./user.js";
import {products} from "./products.js";
// User ↔ Cart
Users.hasOne(Cart, {
    foreignKey: "userId",
    as: "cart",
    onDelete: "CASCADE",
});

Cart.belongsTo(Users, {
    foreignKey: "userId",
    as: "user",
});


// Cart ↔ CartItem
Cart.hasMany(CartItem, {
    foreignKey: "cartId",
    as: "items",
    onDelete: "CASCADE",
});

CartItem.belongsTo(Cart, {
    foreignKey: "cartId",
    as: "cart",
});


// Product ↔ CartItem
products.hasMany(CartItem, {
    foreignKey: "productId",
    as: "cartItems",
    onDelete: "CASCADE",
});

CartItem.belongsTo(products, {
    foreignKey: "productId",
    as: "product",
});


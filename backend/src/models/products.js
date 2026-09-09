import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db.js";

export const products = sequelize.define("Products", {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    type:{
        type:DataTypes.ENUM('product', 'service'),
        defaultValue:'product',
        allowNull:false
    },
    title:{
        type:DataTypes.STRING(50),
        allowNull:false
    },
    sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    description:{
        type:DataTypes.STRING(500),
    },
    price:{
        type:DataTypes.DECIMAL(10, 2),
        allowNull:false
    },
    category:{
        type:DataTypes.STRING(50),
    },
    stockQTY:{
        type:DataTypes.INTEGER,
    },
    status:{
        type:DataTypes.ENUM('sold', 'available', 'unavailable', 'removed'),
    },
    location:{
        type:DataTypes.STRING
    }
}, {
    timestamps:true
});

export const ProductImages = sequelize.define("ProductImages", {
    id: {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    url:{
        type:DataTypes.STRING
    }
});

import Users from "./user.js";

products.belongsTo(Users, {
    foreignKey: "sellerId",
    as: "seller",
});

Users.hasMany(products, {
    foreignKey: "sellerId",
    as: "products",
    onDelete: "CASCADE",
});

products.hasOne(ProductImages, {onDelete:"CASCADE"});
ProductImages.belongsTo(products);



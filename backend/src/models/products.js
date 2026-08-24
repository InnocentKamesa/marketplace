import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db";

const Products = sequelize.define("Products", {
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
        type:DataTypes.ENUM('sold', 'inactive', 'active', 'removed'),
    },
    location:{
        type:DataTypes.STRING
    }
}, {
    timestamps:true
});

const ProductImages = sequelize.define("ProductImages", {
    id: {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    url:{
        type:DataTypes.STRING
    }
});

Products.hasOne(ProductImages, {onDelete:"CASCADE"});
ProductImages.belongsTo(Products);

module.exports = {Products, ProductImages};

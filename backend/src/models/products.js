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

products.hasOne(ProductImages, {onDelete:"CASCADE"});
ProductImages.belongsTo(products);



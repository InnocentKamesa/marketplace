import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db";

const Listings = sequelize.define("Listings", {
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
        type:DataTypes.ENUM('draft', 'active', 'paused', 'deleted'),
    },
    location:{
        type:DataTypes.STRING
    }
}, {
    timestamps:true
});

const ListingImages = sequelize.define("ListingImages", {
    id: {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    url:{
        type:DataTypes.STRING
    }
});

Listings.hasOne(ListingImages, {onDelete:"CASCADE"});
ListingImages.belongsTo(Listings);

module.exports = {Listings, ListingImages};
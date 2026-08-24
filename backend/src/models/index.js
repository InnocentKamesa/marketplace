// models/index.js

import User from "./User.js";
import Products from "./products.js";

User.hasMany(Products, {
  foreignKey: "userId",
  as: "products",
});

Products.belongsTo(User, {
  foreignKey: "userId",
  as: "seller",
});

export {
  User,
  Product,
};

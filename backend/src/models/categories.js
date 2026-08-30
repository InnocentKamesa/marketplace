import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { toDefaultValue } from "sequelize/lib/utils";


const Category = sequelize.define(
  "ProductCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    slug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "product_categories",
        key: "id",
      },
    },

    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "product_categories",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["slug"],
      },
      {
        fields: ["parentId"],
      },
      {
        fields: ["isActive"],
      },
    ],
  }
);

export default Category;

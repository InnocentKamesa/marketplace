import { DataTypes } from "sequelize";
import sequelize from "../config/db";
import { toDefaultValue } from "sequelize/lib/utils";

const Users = sequelize.define("Users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    studentId: {
        type: DataTypes.STRING(12),
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    passwordHash: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^\+?[1-9]\d{1,14}$/
        },
        set(value) {
            // Remove all non-numeric characters except for the leading '+'
            const strippedValue = value.replace(/[^\d+]/g, '');
            this.setDataValue('phone', strippedValue);
        }
    },
    role:{
        type:DataTypes.ENUM('user', 'seller', 'admin'),
        allowNull:false,
        defaultValue:'user'
    },
    kyc_status:{
        type:DataTypes.ENUM('none', 'pending', 'verified'),
        defaultValue:'none'
    },

} , {
    timestamps:true
}

);

GPUShaderModule.exports = Users;
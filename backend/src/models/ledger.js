import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const LedgerAccounts = sequelize.define("LedgerAccounts", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    owner_type: {
        type: DataTypes.ENUM("user", "platform", "escrow_pool"),
        allowNull: false
    },
    owner_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: "USD"
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: "ledger_accounts"
});

const LedgerEntries = sequelize.define("LedgerEntries", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    transaction_id: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: LedgerAccounts,
            key: "id"
        }
    },
    direction: {
        type: DataTypes.ENUM("debit", "credit"),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    balance_after: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    reference_type: {
        type: DataTypes.ENUM("order", "payout", "refund"),
        allowNull: true
    },
    reference_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: "ledger_entries"
});

LedgerAccounts.hasMany(LedgerEntries, {
    foreignKey: "account_id",
    onDelete: "CASCADE"
});
LedgerEntries.belongsTo(LedgerAccounts, {
    foreignKey: "account_id"
});

module.exports = { LedgerAccounts, LedgerEntries };
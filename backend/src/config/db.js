import dotenv from "dotenv";
import { Sequelize } from "sequelize"

dotenv.config()

const env = process.env.ENVIRONMENT || "development";
let sequelize = null;

if (env === "development") {
    sequelize = new Sequelize(process.env.LOCAL_DB, process.env.LOCAL_DB_USER, process.env.LOCAL_DB_PASS, {
        host: process.env.LOCAL_DB_HOST,
        dialect: "postgres",
        logging: false
    })
}
else if (env === "production") {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Required for Supabase cloud connection
            }
        },
        logging: false // Set to console.log if you want to see SQL queries
    });
}
else {
    throw new Error("Failed to connect to databse")
}

export default sequelize;
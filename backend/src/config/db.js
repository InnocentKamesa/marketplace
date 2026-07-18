import dotenv from "dotenv";
import {Sequelize} from "sequelize"

dotenv.config()

const env = process.env.ENVIRONMENT || "development";
let sequelize = null;

if(env === "development"){
    sequelize = new Sequelize(process.env.LOCAL_DB, process.env.LOCAL_DB_USER, process.env.LOCAL_DB_PASS, {
        host:process.env.LOCAL_DB_HOST,
        dialect:"postgres",
        logging:false
    })
}
else if(env === "producation"){
    sequelize = null
}
else {
    throw new Error("Failed to connect to databse")
}

export default sequelize;
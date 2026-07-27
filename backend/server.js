import app from "./app.js";
import { Sequelize } from "sequelize";
import sequelize from "./src/config/db.js";

const port = process.env.LOCAL_API_PORT || 3000;


//server function
async function StartServer(){
    try{
    await sequelize.authenticate();
    console.log("Database connected!")

    await sequelize.sync();

    app.listen(port, ()=> {
    console.log(`Server running on port: ${port}`)
    })
} catch (error) {
    console.error("Unable to initialize the server")
    console.error(error)
}
}

StartServer()

import express from "express";
import dotenv from "dotenv";
import authRouter from "./src/apps/auth/router.js";
//import errorHandler from "./src/middlewares/errorHandler.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

dotenv.config();

const app = express();

//essential middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(morgan('dev'));

//error handling middleware
//app.use(errorHandler);


//cors
const corsOptions = {
    origin:"http://localhost:3000",
    credentials:true,
}
app.use(cors(corsOptions))


//app routers
app.use("/api/auth/", authRouter);


export default app;

import express from "express";
import { registrationValidator } from "./validator.js";
import { register } from "./controller.js";

const authRouter = express.Router();

authRouter.post("/register/", registrationValidator, register);

export default authRouter;
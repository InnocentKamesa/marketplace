import express from "express";
import { registrationValidator, loginValidator } from "./validator.js";
import { register, login } from "./controller.js";

const authRouter = express.Router();

authRouter.post("/register/", registrationValidator, register);
authRouter.post("/login/", loginValidator, login);

export default authRouter;
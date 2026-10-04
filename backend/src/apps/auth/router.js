import express from "express";
import { registrationValidator, loginValidator } from "./validator.js";
import { register, login, me } from "./controller.js";
import { authenticate } from "./middleware.js";

const authRouter = express.Router();

authRouter.post("/register/", registrationValidator, register);
authRouter.post("/login/", loginValidator, login);
authRouter.get("/me/", authenticate, me);

export default authRouter;
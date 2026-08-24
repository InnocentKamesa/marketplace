import express from "express";
import {productValidator} from "./validator.js";
import {addProduct} from "./controller.js";

const productRouter = express.Router()

productRouter.post("/add/", productValidator, addProduct)

export default productRouter

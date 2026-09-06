import express from "express";
import {productValidator} from "./validator.js";
import {addProduct, getAll, search, getProduct} from "./controller.js";

const productRouter = express.Router()

productRouter.post("/add/", productValidator, addProduct)
productRouter.get("/all/", getAll)
productRouter.get("/search/", search)
productRouter.get("/:id/", getProduct)
export default productRouter

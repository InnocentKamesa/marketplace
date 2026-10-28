
import { z } from "zod";

const quantityUpdateSchema = z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().min(1).max(1000),
}).strict();


export const syncCartSchema = z.object({
    items: z.array(cartSyncItemSchema)
        .min(1, "Cart must contain at least one item")
        .max(100, "Too many cart items"),
})


export const CartSyncValidator = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.flatten(),
        });
    }

    req.body = result.data;
    next();
};
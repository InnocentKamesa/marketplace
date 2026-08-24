mport { z } from "zod";

const productSchema = z.object({
    type: z.enum(["product", "service"]),

    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be less than 100 characters"),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must be less than 2000 characters"),

    price: z
      .number()
      .positive("Price must be greater than 0"),

    category: z
      .string()
      .trim()
      .min(1, "Category is required"),

    stockQTY: z
      .number()
      .int("Stock quantity must be a whole number")
      .min(0, "Stock quantity cannot be negative"),

    status: z.enum([
        "active",
        "inactive",
        "sold",
        "removed",
      ]),

    location: z
      .string()
      .trim()
      .min(2, "Location is required")
      .max(100, "Location must be less than 100 characters"),
});
  ])
});

export const productValidator = (req, res, next) => {
  const {title, description, price, type, stockQTY, status, category} = req.body;

  if(!title || !description || !price || !type || !stockQTY || !status || !category) {
    return res.status(400).json({message: "All fields required"});
  }
  const validation = roductSchema.safeParse(req.body);
  if(!validation.success){
    return res.status(400).json({message:"Input validation failed"});
  }

  next()
}

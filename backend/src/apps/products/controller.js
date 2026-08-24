import { createProduct } from "./services/products.js";

export const addProduct = async (req, res) => {
      try {
          const sellerId = req.user.id;

          const product = await createProduct({
              sellerId,
              ...req.body,
            });

          return res.status(201).json({
              success: true,
              message: "Product created successfully",
              product,
            });
          } catch (error) {
          console.error("Add product error:", error);

          return res.status(error.statusCode || 500).json({
              success: false,
              message: error.message || "Failed to create product",
            });
          }
  };

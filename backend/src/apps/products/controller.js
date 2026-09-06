import { createProduct, getHomeSections, searchProducts, getProductById } from "./services/products.js";


// controllers/product.controller.js


export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if(!id || id < 1) {
      return res.status(400).json({message:"Enter a valid product id"})
    }

        const product = await getProductById(id);

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        if (error.message === "Product not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve product"
        });
    }
};


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


export const getAll = async (req, res) => {
    try {
        const sections = await getHomeSections();

        return res.status(200).json({
            success: true,
            data: sections
          });
        } catch (error) {
        console.error("Error fetching home sections:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch home sections"
          });
  }
}

       
export const search = async (req, res) => {
      try {
            const { q, page, limit } = req.query;
            const result = await searchProducts(q);

            res.status(200).json({
                  success: true,
                  data: result
              });
        } catch (error) {
            res.status(500).json({
                  success: false,
                  message: error.message
              });
        }
};


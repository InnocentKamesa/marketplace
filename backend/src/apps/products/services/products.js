import {Products} from "../../../models/products.js";
import Category from "../../../models/categories.js";

export const createProduct = async ({
      sellerId,
      type,
      title,
      description,
      price,
      category,
      stockQTY,
      location,
    }) => {

      // 1. Validate required business data
     if (!sellerId) {
      const error = new Error("Seller is required");
      error.statusCode = 401;
      throw error;
      }
  
   // 2. Verify category exists
    //const existingCategory = await Category.findByPk(category);
//    if (!existingCategory) {
//      const error = new Error("Invalid category");
  //    error.statusCode = 400;
    //  throw error;
//    }
  
    // 3. Apply marketplace business rule
    1// Services don't necessarily have physical stock
    if (type === "service") {
      stockQTY = null;
    }
    
    // A newly created listing should become active
    const status = "active";

    // 4. Create the product
    const product = await Products.create({
      sellerId,
      type,
      title,
      description,
      price,
      category,
      stockQTY,
      location,
      status,
    });

  // 5. Return the newly created product
   return product;
   };


export const getHomeSections = async () => {
      const [latest, services, essentials, electronics, campusLiving] =
      await Promise.all([
              Product.findAll({
                  where: { status: "available" },
                  limit: 10,
                  order: [["createdAt", "DESC"]]
                }),

              Product.findAll({
                  where: {
                      status: "available",
                      type: "service"
                    },
                  limit: 10,
                  order: [["createdAt", "DESC"]]
                }),

              Product.findAll({
                  where: {
                      status: "available",
                      category: "essentials"
                    },
                  limit: 10,
                  order: [["createdAt", "DESC"]]
                }),

              Product.findAll({
                  where: {
                      status: "available",
                      category: "electronics"
                    },
                  limit: 10,
                  order: [["createdAt", "DESC"]]
                }),

              Product.findAll({
                  where: {
                      status: "available",
                      category: "campus-living"
                    },
                  limit: 10,
                  order: [["createdAt", "DESC"]]
                })
            ]);

      return {
          latest,
          services,
          essentials,
          electronics,
          campusLiving
        };
  };
}


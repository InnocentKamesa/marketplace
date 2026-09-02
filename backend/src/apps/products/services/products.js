import {products} from "../../../models/products.js";
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
    const status = "available";

    // 4. Create the product
    const product = await products.create({
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
              products.findAll({
                  where: { status: "available" },
                  limit: 10,
                  order: [["createdAt", "DESC"]]
                }),

              products.findAll({
                  where: {
                      status: "available",
                      type: "service"
                    },
                  limit: 10,
                  order: [["createdAt", "DESC"]]
                }),

              products.findAll({
                  where: {
                      status: "available",
                      category: "essentials"
                    },
                  limit: 10,
                  order: [["createdAt", "DESC"]]
                }),

              products.findAll({
                  where: {
                      status: "available",
                      category: "electronics"
                    },
                  limit: 10,
                  order: [["createdAt", "DESC"]]
                }),

              products.findAll({
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

export const searchProducts = async ({
    q,
    page = 1,
    limit = 20,
}) => {
    if (!q || !q.trim()) {
        return {
            products: [],
            pagination: {
                page,
                limit,
                total: 0,
                pages: 0,
            },
        };
    }

    const offset = (page - 1) * limit;
    const searchTerm = q.trim();

    const replacements = {
        searchTerm,
        limit,
        offset,
    };

    const [products, countResult] = await Promise.all([
        sequelize.query(
            `
            SELECT *
            FROM "products"
            WHERE "title" % :searchTerm
            ORDER BY similarity("title", :query) DESC, "createdAt" DESC
            LIMIT :limit
            OFFSET :offset
            `,
            {
                replacements,
                type: sequelize.QueryTypes.SELECT,
                model: products,
                mapToModel: true,
            }
        ),

        sequelize.query(
            `
            SELECT COUNT(*)::int AS "count"
            FROM "products"
            WHERE "title" % :searchTerm
            `,
            {
                replacements: { searchTerm },
                type: sequelize.QueryTypes.SELECT,
            }
        ),
    ]);

    const total = countResult[0]?.count || 0;

    return {
        products,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

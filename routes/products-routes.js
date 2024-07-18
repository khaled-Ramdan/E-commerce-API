import express from "express"
import { addNewProduct, deleteProduct, getAllProducts, getProductDetails, updateProductDetails } from "../Controllers/prodcuts-controllers.js"
import { isAdmin } from "../middleware/authentication.js"

const router = express.Router()

router.route("/products").get(getAllProducts).post(isAdmin, addNewProduct)

router
    .route("/products/:id")
    .get(getProductDetails)
    .put(isAdmin, updateProductDetails)
    .delete(isAdmin, deleteProduct)


export default router
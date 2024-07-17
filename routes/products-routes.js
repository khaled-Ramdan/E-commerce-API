import express from "express"
import { addNewProduct, deleteProduct, getAllProducts, getProductDetails, updateProductDetails } from "../Controllers/prodcuts-controllers.js"

const router = express.Router()

router.route("/products").get(getAllProducts).post(addNewProduct)

router
    .route("/products/:id")
    .get(getProductDetails)
    .put(updateProductDetails)
    .delete(deleteProduct)


export default router
import express from "express"
import {
    getAllCategories,
    addNewCategory,
    getCategoryDetails,
    updateCategory,
    deleteCategory,
} from "../Controllers/categories-controllers.js"
import { isAdmin } from "../middleware/authentication.js"
const router = express.Router()

router.route("/categories").get(getAllCategories).post(isAdmin, addNewCategory)
router
    .route("/categories/:id")
    .get(getCategoryDetails)
    .put(isAdmin, updateCategory)
    .delete(isAdmin, deleteCategory)

export default router

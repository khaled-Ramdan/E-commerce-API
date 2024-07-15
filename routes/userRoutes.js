import express from "express"
import {
    register,
    login,
    logout,
    getAllUsers,
    getUserDetails,
    UpdateUserDetails,
    deleteUser,
} from "../Controllers/userControllers.js"
import { isAdmin } from "../middleware/authentication.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(logout)
router.route("/users").get(isAdmin, getAllUsers)
router
    .route("/users/:id", isAdmin)
    .get(getUserDetails)
    .put(UpdateUserDetails)
    .delete(deleteUser)

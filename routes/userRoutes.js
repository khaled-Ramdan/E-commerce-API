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
import { isAdmin, userAuth } from "../middleware/authentication.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(userAuth, logout)
router.route("/users").get(userAuth, isAdmin, getAllUsers)
router
    .route("/users/:id", userAuth, isAdmin)
    .get(getUserDetails)
    .put(UpdateUserDetails)
    .delete(deleteUser)

export default router
import express from "express"
// import passport from "passport"
import {
    register,
    login,
    getAllUsers,
    getUserDetails,
    UpdateUserDetails,
    deleteUser,
    logout,
} from "../Controllers/userControllers.js"
import { isAdmin, userAuth } from "../middleware/authentication.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/users").get(userAuth, isAdmin, getAllUsers)
router
    .route("/users/:id")
    .get(userAuth, isAdmin, getUserDetails)
    .put(userAuth, UpdateUserDetails)
    .delete(userAuth, isAdmin, deleteUser)

router.route("/logout").get(userAuth, logout)

export default router
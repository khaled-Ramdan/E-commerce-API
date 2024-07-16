import express from "express"
import { failAuthentication, gooleLogin, logout } from "../Controllers/userControllers.js"

const router = express.Router()

router.route("/auth/success").get(gooleLogin)
router.route("/auth/failure").get(failAuthentication)
router.route("/logout").get(logout)


export default router
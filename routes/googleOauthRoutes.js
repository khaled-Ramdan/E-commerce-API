import express from "express"
import {
    failAuthentication,
    gooleLogin,
} from "../Controllers/userControllers.js"

const router = express.Router()

router.route("/auth/success").get(gooleLogin)
router.route("/auth/failure").get(failAuthentication)



export default router
import express from "express"
import {
    failAuthentication,
    gooleLogin,
} from "../Controllers/user-controllers.js"

const router = express.Router()

router.route("/auth/success").get(gooleLogin)
router.route("/auth/failure").get(failAuthentication)



export default router
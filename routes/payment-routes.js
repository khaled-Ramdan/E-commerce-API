import express from "express"
import {
    failurePayment,
    paymentSession,
    successPayment,
    webhook,
} from "../Controllers/payment-controllers.js"
import { userAuth } from "../middleware/authentication.js"
import bodyParser from "body-parser"

const router = express.Router()

router.route("/success").get(successPayment)
router.route("/cancel").get(failurePayment)

router.route("/:orderId/pay").get(userAuth, paymentSession)
router
    .route("/webhook")
    .post(express.raw({ type: "application/json" }), webhook)

export default router

import express from "express"
import {
    addNewOrder,
    deleteOrder,
    getAllOrders,
    getOrderDetails,
    updateOrder,
} from "../Controllers/orders-controllers.js"

const router = express.Router()

router.route("/orders").get(getAllOrders).post(addNewOrder)

router
    .route("/orders/:id")
    .get(getOrderDetails)
    .put(updateOrder)
    .delete(deleteOrder)

export default router
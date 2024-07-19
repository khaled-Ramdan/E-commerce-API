import express from "express"

const router = express.Router()

router.route("/orders").get(getAllOrders).post(addNewOrder)

router
    .route("orders/:id")
    .get(getOrderDetails)
    .put(updateOrder)
    .delete(deleteOrder)

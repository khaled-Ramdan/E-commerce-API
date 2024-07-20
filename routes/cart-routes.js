import express from "express"
import {
    addItemToCart,
    deleteCartItem,
    getUserCart,
    updateCartItemQuantity,
} from "../Controllers/cart-controllers.js"

const router = express.Router()

router.route("/cart").get(getUserCart).post(addItemToCart)
router.route("/cart/:itemId").put(updateCartItemQuantity).delete(deleteCartItem)



export default router
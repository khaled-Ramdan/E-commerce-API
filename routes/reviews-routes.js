import express from "express"
import {
    addNewReviewForProduct,
    deleteReview,
    getReviewsOfProduct,
    updateAReview,
} from "../Controllers/Reviews-controllers.js"

const router = express.Router()

router
    .route("/products/:id/reviews")
    .get(getReviewsOfProduct)
    .post(addNewReviewForProduct)

router
    .route("/products/:id/reviews/:reviewId")
    .put(updateAReview)
    .delete(deleteReview)

export default router
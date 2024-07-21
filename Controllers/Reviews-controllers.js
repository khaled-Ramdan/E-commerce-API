import asyncHandler from "express-async-handler"
import Review from "../DataBase/models/ReviewModel.js"

export const getReviewsOfProduct = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const { limit, skip, page, size } = req.pagination
    const reviews = await Review.find({ product: id }).limit(limit).skip(skip)
    res.status(200).json({
        message: "product reviews returned successfully",
        page,
        size,
        dataSize: reviews.length,
        data: reviews,
    })
})
export const addNewReviewForProduct = asyncHandler(async (req, res, next) => {
    const { rating, comment } = req.body

    const newReview = await Review.create({
        product: req.params.id,
        user: req.user._id,
        rating,
        comment,
    })

    res.status(201).json({
        message: "product review has been created successfully",
        data: newReview,
    })
})
export const updateAReview = asyncHandler(async (req, res, next) => {
    const { id, reviewId } = req.params
    const { rating, comment } = req.body
    const newReview = await Review.findByIdAndUpdate(
        reviewId,
        {
            rating,
            comment,
        },
        { new: true, runValidators: true }
    )
    res.status(200).json({
        message: "product reviews details showed successfully",
        data: newReview,
    })
})
export const deleteReview = asyncHandler(async (req, res, next) => {
    const { reviewId } = req.params
    await Review.findByIdAndDelete(reviewId)
    res.sendStatus(204)
})
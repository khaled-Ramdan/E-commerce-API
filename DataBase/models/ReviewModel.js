import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: String,
    },
    { timestamps: true }
)

reviewSchema.index({ product: 1, user: 1 })
const Review = mongoose.model("Review", reviewSchema)

export default Review

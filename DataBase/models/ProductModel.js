import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: [1, "min length is 1"],
            maxlength: [255, "max length is 255"],
        },
        description: {
            type: String,
            maxlength: [
                2000,
                "description must be at most 2000 characters long",
            ],
        },
        price: { type: Number, required: true },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        stock: { type: Number, required: true },
        images: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Image",
            },
        ],
    },
    { timestamps: true }
)

const Product = mongoose.model("Product", productSchema)

export default Product

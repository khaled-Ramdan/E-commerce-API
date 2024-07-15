import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: String,
        price: { type: Number, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        stock: { type: Number, required: true },
        images: [String],
    },
    { timestamps: true }
)

const Product = mongoose.model("Product", productSchema)

export default Product

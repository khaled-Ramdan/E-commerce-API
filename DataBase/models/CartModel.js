import mongoose from "mongoose"

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: { type: Number, required: true },
            },
        ],
    },
    { timestamps: true }
)
cartSchema.index({ user: 1 })

const Cart = mongoose.model("Cart", cartSchema)

export default Cart

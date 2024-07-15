import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
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
                price: { type: Number, required: true },
            },
        ],
        totalPrice: { type: Number, required: true },
        shippingAddress: {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        },
        status: {
            type: String,
            enum: ["pending", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
)

const Order = mongoose.model("Order", orderSchema)

export default Order

import mongoose from "mongoose"
import User from "./UserModel.js"

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

orderSchema.pre("save", async function (next) {
    if (!this.shippingAddress || !this.shippingAddress.street) {
        try {
            const user = await User.findById(this.userId)
            if (user) {
                this.shippingAddress = {
                    street: user.address.street,
                    city: user.address.city,
                    state: user.address.state,
                    zip: user.address.zip,
                    country: user.address.country,
                }
            }
        } catch (err) {
            return next(err)
        }
    }
    next()
})

const Order = mongoose.model("Order", orderSchema)

export default Order

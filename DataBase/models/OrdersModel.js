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
                // price: { type: Number, required: true },
            },
        ],
        totalPrice: { type: Number, required: true },
        shippingAddress: {
            street: {
                type: String,
                minlength: [1, "min length is 1"],
                maxlength: [255, "max length is 255"],
            },
            city: {
                type: String,
                minlength: [1, "min length is 1"],
                maxlength: [255, "max length is 255"],
            },
            state: {
                type: String,
                minlength: [1, "min length is 1"],
                maxlength: [255, "max length is 255"],
            },
            zip: {
                type: String,
                minlength: [1, "min length is 1"],
                maxlength: [255, "max length is 255"],
            },
            country: {
                type: String,
                minlength: [1, "min length is 1"],
                maxlength: [255, "max length is 255"],
            },
        },
        status: {
            type: String,
            enum: ["pending", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
)

orderSchema.pre("save", async function (next) {
    if (!this.shippingAddress || !this.shippingAddress.street) {
        try {
            const user = await User.findById(this.user)
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

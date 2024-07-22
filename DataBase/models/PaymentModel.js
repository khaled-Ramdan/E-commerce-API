import mongoose from "mongoose"

const PaymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        amount_total: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
        },
        customer_details: {
            address: {
                city: String,
                country: String,
                line1: String,
                line2: String,
                postal_code: String,
                state: String,
            },
            email: String,
            name: String,
            phone: String,
            tax_exempt: String,
            tax_ids: [],
        },
        payment_status: String,
        status: String,
    },
    { timestamps: true }
)

PaymentSchema.pre("save", function () {
    this.amount_total /= 100
})

const Payment = mongoose.model("Payment", PaymentSchema)

export default Payment

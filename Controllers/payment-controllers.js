import asyncHandler from "express-async-handler"
import Stripe from "stripe"
import Order from "../DataBase/models/OrdersModel.js"
import Payment from "../DataBase/models/PaymentModel.js"
import AppError from "../ErrorHandler/appError.js"
import sendMail from "../utils/mailer.js"

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY)

export const paymentSession = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params // order items
    const order = await Order.findById(orderId).populate({
        path: "items.product",
    })
    if (!order)
        return next(
            new AppError("Something went wrong. Order not found!! ", 404)
        )
    if (order.user.toString() != req.user._id.toString())
        return next(new AppError("This Order is not for this user", 400))

    if (order.isPaid)
        return next(new AppError("This Order is aleady paid", 400))

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: order.items.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.product.name,
                    },
                    unit_amount: item.product.price * 100,
                },
                quantity: item.quantity,
            }
        }),
        success_url: `${process.env.SERVER_URL}/api/payment/success`,
        cancel_url: `${process.env.SERVER_URL}/api/payment/cancel`,
        metadata: { orderId: order._id.toString() },
    })
    res.status(200).json({ url: session.url })
})

export const successPayment = asyncHandler(async (req, res, next) => {
    // order => isPaid = true
    // console.log(req)
    res.status(200).json({ message: "payment successful" })
})
export const failurePayment = asyncHandler(async (req, res, next) => {
    res.status(400).json({ message: "payment canceled" })
})
// stripe listen --forward-to http://localhost:5000/api/payment/webhook => to listen for the webhock
export const webhook = asyncHandler(async (req, res, next) => {
    const sig = req.headers["stripe-signature"]

    let event
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message)
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle the event
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object

            // Fulfill the purchase...
            handleCheckoutSession(session)
            break
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`)
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true })
})

async function handleCheckoutSession(session) {
    const orderId = session.metadata.orderId
    const order = await Order.findById(orderId).populate({
        path: "items.product",
    })
    if (order) {
        order.isPaid = true
        await order.save()
    }
    const payment = await Payment.create({ ...session, order: orderId })
    // Send email with this payment

    await sendMail(
        [payment.customer_details.email],
        "Order payment",
        "Your order has been Paid successfully!",
        `
            
            <h1>Order name: ${order._id}</h1>
            <h2> Shipping Address : ${order.shippingAddress.street}, ${
            order.shippingAddress.city
        }, ${order.shippingAddress.state}, ${
            order.shippingAddress.country
        }</h2>

            <p>
                <h2>Items : </h2> 
                    ${order.items.map(
                        (item) =>
                            `<h3>name: ${item.product.name}</h3> <h4>description: ${item.product.description}</h4> <h4>quantity: ${item.quantity}</h4>`
                    ).join("")}

            </p>

            <h3>payment Id: ${payment._id} </h3>
            <h3>amount: ${payment.amount_total} ${payment.currency}</h3>
            <h3>status: ${payment.status} </h3>
            <h3>payment status: ${payment.payment_status} </h3>
            
        `
    )
}

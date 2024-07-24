process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...")
    console.log(err.name, err.message)
    process.exit(1)
})

import express from "express"
import xss from "xss-clean"
import hpp from "hpp"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import dotenv from "dotenv"
import morgan from "morgan"
import bodyParser from "body-parser"
import mongosanitize from "express-mongo-sanitize"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import session from "express-session"
import passport from "passport"
import slowDown from "express-slow-down"
import stripe from "stripe"

import { globalErrorrHandling } from "./ErrorHandler/errorHandler.js"
import AppError from "./ErrorHandler/appError.js"
import { swaggerDocument, swaggerOptions } from "./swagger/swagger.js"
import userRoutes from "./routes/user-routes.js"
import productsRoutes from "./routes/products-routes.js"
import googleAuthRoutes from "./routes/google-oauth-routes.js"
import categoriesRoutes from "./routes/categories-routes.js"
import orderesRoutes from "./routes/orders-routes.js"
import cartRoutes from "./routes/cart-routes.js"
import reviewsRoutes from "./routes/reviews-routes.js"
import paymentRoutes from "./routes/payment-routes.js"
import uploadFiles from "./routes/upload-files.js"
import "./middleware/google-ouath.js"
import { paginationMiddleware } from "./middleware/helper.js"
import "./DataBase/redis-connection.js"
import { userAuth } from "./middleware/authentication.js"

dotenv.config()

stripe(process.env.STRIPE_PRIVATE_KEY)

const app = express()
app.use(
    session({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
)
app.use(passport.initialize())
app.use(passport.session())
// INITIALIZE SWAGGER
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerOptions)
)

// SET SECURITY HTTP HEADERS
app.use(helmet())

// TEST MIDDLEWARE
app.use((req, res, next) => {
    req.timeRequested = new Date().toISOString()
    console.log("Hello from Middleware")
    next()
})

// Show the -> (Http method , route_url , status-code , token time of req )
app.use(morgan("dev"))

app.use("/api/payment", paymentRoutes) // =>>>>>>> THIS MUST BE BEFORE app.use(espress.json()) to work
/*The main issue arises when we utilize the express.json() middleware on the server. This middleware is essential for extracting data, such as IDs or any other information we wish to store.

The optimal solution to this problem is as follows:

Create a separate router file specifically for the webhook endpoint. Avoid consolidating all Stripe-related code within the webhook file, as it requires data extraction from JSON files.

Declare this file in your server or wherever your main file resides, just before invoking or passing the express.json middleware.

By implementing this approach, the data won't pass through the middleware, ensuring that it remains in its raw form. Consequently, you can utilize the same endpoint without any confusion.

In the image below image, the stripeRouter contains all the endpoints related to Stripe such as creating a customer, checkout session, and payment intent. On the other hand, in the stripeWebhook router, only the webhook endpoint is kept just before passing it to the JSON middleware. This separation ensures a cleaner organization and better handling of data flow. */
// to get data from req (req.body)
app.use(bodyParser.json())
app.use(express.json({ limit: "10kB" }))
// Data sanitization against NoSQl Query injection ({"$gt":""} ->{"gt":""} )
app.use(mongosanitize())

// Data sanitization against Xss (convert tages to html entities )
app.use(xss())

// prevent parameter pollution
app.use(hpp())

app.use(
    cors({
        origin: process.env.UI_ORIGIN,
    })
)
// HANDLE THE MAXIMUM NUMBER OF REQUESTS PER HOUR FROM THE SAME API
const limitter = rateLimit({
    max: 200,
    windowMs: 15 * 60 * 1000,
    message:
        "Too many request from this IP , please try again in an 15 minutes.",
})

const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 5, // Allow 5 requests per 15 minutes.
    delayMs: (hits) => hits * 100, // Add 100 ms of delay to every request after the 5th one.

    /**
     * So:
     *
     * - requests 1-5 are not delayed.
     * - request 6 is delayed by 600ms
     * - request 7 is delayed by 700ms
     * - request 8 is delayed by 800ms
     *
     * and so on. After 15 minutes, the delay is reset to 0.
     */
})
app.use(speedLimiter)
app.use(limitter)

app.get("/", (req, res) =>
    res.send(
        `<h1>wellcome to E-commerce API </h1><h2>For documentation : <a href="/api-docs">Here </a></h2>`
    )
)
// GOOGLE AUTHENTICATION
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
)
app.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "api/auth/success",
        failureRedirect: "api/auth/failure",
    })
)

// ROUTES
app.use("/google/api", googleAuthRoutes)
app.use("/api", paginationMiddleware, userRoutes)
app.use("/api", paginationMiddleware, userAuth, productsRoutes)
app.use("/api", paginationMiddleware, userAuth, categoriesRoutes)
app.use("/api", paginationMiddleware, userAuth, orderesRoutes)
app.use("/api", paginationMiddleware, userAuth, cartRoutes)
app.use("/api", paginationMiddleware, userAuth, reviewsRoutes)
app.use("/api", paginationMiddleware, userAuth, uploadFiles)


// For any (un) Hnadled route
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 500))
})

app.use(globalErrorrHandling)

export default app


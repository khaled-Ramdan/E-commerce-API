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
import uploadFiles from "./routes/upload-files.js"
import "./middleware/google-ouath.js"
import { paginationMiddleware } from "./middleware/helper.js"
import "./DataBase/redis-connection.js"
import { userAuth } from "./middleware/authentication.js"
dotenv.config()

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

// to get data from req (req.body)
app.use(express.json({ limit: "10kB" }))
app.use(bodyParser.json())
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
    max: 500,
    windowMs: 60 * 60 * 100,
    message: "Too many request from this IP , please try again in an hour.",
})

app.use("/api", limitter)
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

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
import { globalErrorrHandling } from "./ErrorHandler/errorHandler.js"
import AppError from "./ErrorHandler/appError.js"
import swaggerDocument from "./swagger/swagger.js"
import userRoutes from "./routes/userRoutes.js"

const app = express()
dotenv.config()
// INITIALIZE SWAGGER
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

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

app.use("/api", userRoutes)

// For any (un) Hnadled route
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 500))
})

app.use(globalErrorrHandling)

export default app

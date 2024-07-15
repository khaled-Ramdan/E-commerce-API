process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...")
    console.log(err.name, err.message)
    process.exit(1)
})

import "colors"
import connectDB from "./DataBase/connection.js"
import app from "./app.js"

const PORT = process.env.PORT || 5000
let server

const start = async () => {
    server = app.listen(PORT, () =>
        console.log(`http://127.0.0.1:${PORT}....`.bold.blue)
    )
    await connectDB()
}

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...")
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1)
    })
})

start()

import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const db = process.env.DATABASE_HOST_LINK.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
)

const connectDB = async () => {
    try {
        await mongoose.connect(db)
        console.log("Connected to database successfully".bold.yellow)
    } catch (err) {
        console.log("Error connecting to database".bold.red)
        console.log(err)
        process.exit(1)
    }
}

export default connectDB

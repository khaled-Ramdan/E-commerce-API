import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcryptjs"
import Cart from "./CartModel.js"

const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: validator.isEmail,
        },
        password: { type: String },
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zip: { type: String, required: true },
            country: { type: String, required: true },
        },
        role: { type: String, enum: ["user", "admin"], default: "user" },
    },
    { timestamps: true }
)

userSchema.index({ email: 1 })

userSchema.pre("find", function (next) {
    this.select("-password")
    next()
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.methods.confirmPassword = async function (
    candidatePassword,
    hashedPassword
) {
    return await bcrypt.compare(candidatePassword, hashedPassword)
}

userSchema.post("save", async function (doc, next) {
    await Cart.create({ user: doc._id })
})

const User = mongoose.model("User", userSchema)

export default User

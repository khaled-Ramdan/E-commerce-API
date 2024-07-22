import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcryptjs"
import Cart from "./CartModel.js"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: [2, "Username must be at least 2 characters long"],
            maxlength: [100, "Username must be at most 100 characters long"],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: validator.isEmail,
        },
        password: {
            type: String,
            minlength: [8, "password must be at least 8 characters long"],
            maxlength: [100, "password must be at most 100 characters long"],
        },
        address: {
            street: {
                type: String,
                minlength: [1, "min length is 1"],
                maxlength: [255, "max length is 255"],
                required: true,
            },
            city: {
                type: String,
                minlength: [1, "min length is 1"],
                maxlength: [255, "max length is 255"],
                required: true,
            },
            state: {
                type: String,
                minlength: [1, "min length is 1"],
                maxlength: [255, "max length is 255"],
                required: true,
            },
            zip: {
                type: String,
                minlength: [1, "min length is 1"],
                maxlength: [255, "max length is 255"],
                required: true,
            },
            country: {
                type: String,
                minlength: [1, "min length is 1"],
                maxlength: [255, "max length is 255"],
                required: true,
            },
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

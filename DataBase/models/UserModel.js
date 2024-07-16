import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: validator.isEmail,
        },
        password: { type: String, required: true },
        address: {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        },
        role: { type: String, enum: ["user", "admin"], default: "user" },
    },
    { timestamps: true }
)

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

const User = mongoose.model("User", userSchema)

export default User

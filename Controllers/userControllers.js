import asyncHandler from "express-async-handler"
import User from "../DataBase/models/UserModel.js"
import { createToken } from "../middleware/authentication.js"
import AppError from "../ErrorHandler/appError.js"
import validator from "validator"

export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, address } = req.body
    if (!email || !password)
        return next(new AppError("email and password are required", 400))
    let newuser = await User.create({ name, email, password, address })
    const token = await createToken(newuser)

    res.status(201).json({
        message: "user created successfully",
        data: { newuser, token },
    })
})

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password)
        return next(new AppError("Missing email or password", 400))

    if (!validator.isEmail(email))
        return next(new AppError("Invalid email", 400))

    const user = await User.findOne({ email })
    if (!user) return next(new AppError("User not found", 401))

    if (!(await user.confirmPassword(password, user.password)))
        return next(new AppError("Incorrect password", 401))

    const token = await createToken(user)

    res.status(201).json({
        message: "logged in successfully",
        data: { user, token },
    })
})
export const logout = asyncHandler(async (req, res, next) => {})
export const getAllUsers = asyncHandler(async (req, res, next) => {})
export const getUserDetails = asyncHandler(async (req, res, next) => {})
export const UpdateUserDetails = asyncHandler(async (req, res, next) => {})
export const deleteUser = asyncHandler(async (req, res, next) => {})

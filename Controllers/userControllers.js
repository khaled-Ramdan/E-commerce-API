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
export const getAllUsers = asyncHandler(async (req, res, next) => {
    const { limit, skip, page, size } = req.pagination
    const users = await User.find().select("-password").limit(limit).skip(skip)
    res.status(200).json({
        message: "all users returned successfully",
        page,
        size,
        dataSize: users.length,
        data: users,
    })
})

export const getUserDetails = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).select("-password")
    if (!user) return next(new AppError("This user is not found", 404))
    res.status(200).json({
        message: "user details returned successfully",
        data: user,
    })
})
export const UpdateUserDetails = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name, role } = req.body
    const updateObj = {}
    if (name) updateObj.name = name
    if (role) updateObj.role = role

    const user = await User.findByIdAndUpdate(id, updateObj, { new: true })
    res.status(200).json({ message: "user updated successfully", data: user })
})
export const deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id)
    res.sendStatus(204)
})

export const gooleLogin = asyncHandler(async (req, res, next) => {
    return res.status(200).json(req.user)
})
export const failAuthentication = asyncHandler(async (req, res, next) => {
    return next(new AppError("Google Authentication falid !!", 401))
})

export const logout = asyncHandler(async (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err)
            }
            return res.send("goodbye")
        })
    })
    res.send("goodby")
})
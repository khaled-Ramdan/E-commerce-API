import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import AppError from "../ErrorHandler/appError.js"
import UserModel from "../DataBase/models/UserModel.js"

export const isAdmin = asyncHandler(async (req, res, next) => {
    // console.log(req.user)
    if (req.user.role != "admin")
        return next(new AppError("unotherized !!\n You are not admin.", 401))
    next()
})

export const userAuth = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers && req.headers.authorization
    let token
    if (!authHeader)
        return next(new AppError("Authentication header must be provided", 401))
    if (authHeader.startsWith("Bearer ")) token = authHeader.split(" ")[1]

    if (!token) return next(new AppError("Invalid token !!", 400))

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await UserModel.findById(decoded.id)
    if (!user) return next(new AppError("Error in Authentication !!", 401))

    req.token = token
    req.user = user
    next()
})

export const createToken = asyncHandler(async (user) => {
    return await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
    })
})

import asyncHandler from "express-async-handler"

export const isAdmin = asyncHandler(async (req, res, next) => {
    next()
})

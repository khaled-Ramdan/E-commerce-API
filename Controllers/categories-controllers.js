import asyncHandler from "express-async-handler"
import Category from "../DataBase/models/CategoryModel.js"
import AppError from "../ErrorHandler/appError.js"

export const getAllCategories = asyncHandler(async (req, res, next) => {
    const { limit, skip, page, size } = req.pagination
    const categories = await Category.find().limit(limit).skip(skip)
    res.status(200).json({
        message: "all Categories returned successfully",
        page,
        size,
        dataSize: categories.length,
        data: categories,
    })
})
export const addNewCategory = asyncHandler(async (req, res, next) => {
    const { name, description } = req.body

    const newCategory = await Category.create({
        name,
        description,
    })

    res.status(201).json({
        message: "Category created successfully",
        data: newCategory,
    })
})
export const getCategoryDetails = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const category = await Category.findById(id)
    if (!category)
        return next(
            new AppError("There is no category with the specified id", 404)
        )
    res.status(200).json({
        message: "Category details showed successfully",
        data: category,
    })
})
export const updateCategory = asyncHandler(async (req, res, next) => {
    const { name, description } = req.body

    const newCategory = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name,
            description,
        },
        { new: true, runValidators: true }
    )

    res.status(201).json({
        message: "Category updated successfully",
        data: newCategory,
    })
})
export const deleteCategory = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    await Category.findByIdAndDelete(id)
    res.sendStatus(204)
})

import asyncHandler from "express-async-handler";
import Product from "../DataBase/models/ProductModel.js"

export const getAllProducts = asyncHandler(async (req, res, next) => {
    const { limit, skip, page, size } = req.pagination
    const products = await Product.find(
        {},
        { images: { $slice: 1 }, name: 1, price: 1, category: 1 }
    )
        .limit(limit)
        .skip(skip)
    res.status(200).json({
        message: "all products returned successfully",
        page,
        size,
        dataSize: products.length,
        data: products,
    })
})
export const addNewProduct = asyncHandler(async (req, res, next) => {
    const { name, description, price, category, stock, images, brand } =
        req.body

    const newproduct = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        images,
        brand,
        numReviews: 0,
    })

    res.status(201).json({
        message: "product created successfully",
        data: newproduct,
    })
})
export const getProductDetails = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const product = await Product.findById(id)
    res.status(200).json({
        message: "product details showed successfully",
        data: product,
    })
})
export const updateProductDetails = asyncHandler(async (req, res, next) => {
    
})
export const deleteProduct = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    await Product.findByIdAndDelete(id)
    res.sendStatus(204)
})
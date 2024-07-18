import asyncHandler from "express-async-handler";
import Product from "../DataBase/models/ProductModel.js"
import Image from "../DataBase/models/ImagesModel.js"

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
    const id = req.params.id
    let {
        name,
        description,
        price,
        category,
        stock,
        addImages,
        deleteImages,
        brand,
    } = req.body

    const updateObj = {}
    if (name) updateObj.name = name
    if (name) updateObj.description = description
    if (name) updateObj.price = price
    if (name) updateObj.category = category
    if (name) updateObj.stock = stock
    if (name) updateObj.brand = brand
    if (!addImages) addImages = []
    if (!deleteImages) deleteImages = []

    const toaddImages = await Image.find(
        {
            _id: { $in: addImages },
        },
        { _id: 1 }
    )

    const toDeleteImages = await Image.find(
        {
            _id: { $in: deleteImages },
        },
        { _id: 1 }
    )

    let newProduct = await Product.findByIdAndUpdate(
        id,
        {
            ...updateObj,
            $pull: { images: { $in: toDeleteImages } },
        },
        { new: true, runValidators: true }
    )
    newProduct = await Product.findByIdAndUpdate(
        id,
        {
            $push: { images: { $each: toaddImages } },
        },
        { new: true, runValidators: true }
    )

    res.status(200).json({
        message: "Product updated successfully",
        data: newProduct,
    })
})
export const deleteProduct = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    await Product.findByIdAndDelete(id)
    res.sendStatus(204)
})
import asyncHandler from "express-async-handler"
import Cart from "../DataBase/models/CartModel.js"
import { stringToFloat } from "../utils/helper.js"
import Product from "../DataBase/models/ProductModel.js"
import AppError from "../ErrorHandler/appError.js"

export const getUserCart = asyncHandler(async (req, res, next) => {
    const myCart = await Cart.findOne({ user: req.user._id })
    res.status(200).json({
        message: "Your cart has been successfully retrieved",
        data: myCart,
    })
})
export const addItemToCart = asyncHandler(async (req, res, next) => {
    const item = req.body
    item.quantity = stringToFloat(item.quantity, 1)

    const product = await Product.findById(item.product)
    if (!product)
        return next(new AppError("This product does not exist !!", 404))

    let myCart = await Cart.findOne({ user: req.user._id })
    if (!myCart) myCart = await Cart.create({ user: req.user._id })

    const itemExists = myCart.items.some((it) => it.product == item.product)
    if (itemExists) return next(new AppError("This Item exists !!", 400))

    const newcart = await Cart.findByIdAndUpdate(
        myCart._id,
        {
            $push: { items: item },
        },
        { new: true, runValidators: true }
    )
    res.status(200).json({
        message: "Item added successfully to Cart",
        data: newcart,
    })
})

export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const product = req.params.itemId
    let { newQuantity } = req.body

    if (!newQuantity)
        return next(new AppError("New quantity must be specified", 400))
    newQuantity = stringToFloat(newQuantity, 1)

    let items = (await Cart.findOne({ user: req.user._id })).items

    for (let i = 0; i < items.length; i++) {
        if (items[i].product.toString() === product) {
            items[i].quantity = newQuantity
        }
    }

    let myCart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { items },
        {
            new: true,
            runValidators: true,
        }
    )
    res.status(200).json({
        message: "cart updated successfully",
        data: myCart,
    })
})
export const deleteCartItem = asyncHandler(async (req, res, next) => {
    const product = req.params.itemId
    let items = (await Cart.findOne({ user: req.user._id })).items

    items = items.filter((item) => item.product != product)

    let myCart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { items },
        {
            new: true,
            runValidators: true,
        }
    )
    res.status(200).json({
        message: "cart updated successfully",
        data: myCart,
    })
})

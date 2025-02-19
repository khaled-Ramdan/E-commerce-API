import asyncHandler from "express-async-handler"
import Order from "../DataBase/models/OrdersModel.js"
import Product from "../DataBase/models/ProductModel.js"
import { stringToFloat } from "../utils/helper.js"
import AppError from "../ErrorHandler/appError.js"


export const getAllOrders = asyncHandler(async (req, res, next) => {
    const { limit, skip, page, size } = req.pagination
    let { minTotalPrice, maxTotalPrice, sort, status, userId } = req.query

    minTotalPrice = stringToFloat(minTotalPrice, 0)
    maxTotalPrice = stringToFloat(maxTotalPrice, Infinity)
    const filterObj = {}
    filterObj.totalPrice = { $gte: minTotalPrice }
    filterObj.totalPrice
        ? (filterObj.totalPrice["$lte"] = maxTotalPrice)
        : (filterObj.totalPrice = { $lte: maxTotalPrice })
    if (status) filterObj.status = status

    sort = sort && sort.split(",").join(" ")

    if (req.user.role == "admin") {
        // admin can access all orders for all users
        if (userId) filterObj.user = userId
    } else {
        // user only can access thier orders
        filterObj.user = req.user._id
    }

    const orders = await Order.find(filterObj)
        .sort(sort)
        .skip(skip)
        .limit(limit)

    res.status(200).json({
        message: "all orders returned successfully",
        page,
        size,
        dataSize: orders.length,
        data: orders,
    })
})
export const addNewOrder = asyncHandler(async (req, res, next) => {
    const { items, shippingAddress } = req.body

    const productIdsQuantityMap = {}
    const productIds =
        items &&
        items.map((item) => {
            productIdsQuantityMap[item.product]
                ? (productIdsQuantityMap[item.product] += item.quantity)
                : (productIdsQuantityMap[item.product] = item.quantity || 1)
            return item.product
        })

    const products = await Product.find(
        { _id: { $in: productIds } },
        { price: 1 }
    )
    let totalPrice = 0
    for (let product of products) {
        totalPrice += product.price * productIdsQuantityMap[product._id]
    }

    const neworder = await Order.create({
        user: req.user._id,
        items,
        totalPrice,
        shippingAddress,
    })
    res.status(201).json({
        message: "Order created successfully",
        data: neworder,
    })
})
export const getOrderDetails = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const order = await Order.findById(id)
        .populate({
            path: "user",
        })
        .populate({
            path: "items.product",
        })
    if (!order)
        return next(
            new AppError("There is no order with the specified id", 404)
        )
    res.status(200).json({
        message: "order details showed successfully",
        data: order,
    })
})
export const updateOrder = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    if (req.user.role === "admin") {
        // update status only
        const { status } = req.body
        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        )
        res.status(200).json({
            message: "status updated successfully",
            note: "Admin Can update status Only",
            data: order,
        })
    } else {
        // update order if pending
        const { toAdd, toDelete, shippingAddress } = req.body

        let order = await Order.findById(id)
        const isToDelete = new Map()
        toDelete.forEach((item) => isToDelete.set(item, true))

        let items = order.items.filter(
            (item) => !isToDelete.has(item.product.toString())
        )
        for (let item of toAdd) {
            items.push({
                product: item.product,
                quantity: stringToFloat(item.quantity, 1),
            })
        }
        //..
        const productIdsQuantityMap = {}
        const productIds =
            items &&
            items.map((item) => {
                productIdsQuantityMap[item.product]
                    ? (productIdsQuantityMap[item.product] += item.quantity)
                    : (productIdsQuantityMap[item.product] = item.quantity || 1)
                return item.product
            })


        const products = await Product.find(
            { _id: { $in: productIds } },
            { price: 1 }
        )

        let totalPrice = 0
        for (let product of products) {
            totalPrice += product.price * productIdsQuantityMap[product._id]
        }
        ///
        const neworder = await Order.findByIdAndUpdate(
            id,
            { shippingAddress, items: items, totalPrice },
            { new: true, runValidators: true }
        )
        res.status(200).json({
            message: "Order updated successfully",
            data: neworder,
        })
    }
})
export const deleteOrder = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "admin")
        next(new AppError("Only admin can delete orders", 400))
    const order = await Order.findById(req.params.id)
    if (!order) next(new AppError("Order not found", 404))
    if (order.status != "pending")
        next(new AppError("Only pending orders can be deleted", 400))
    await Order.deleteOne({ _id: req.params.id })
    res.sendStatus(204)
})

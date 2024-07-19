import asyncHandler from "express-async-handler"
import Order from "../DataBase/models/OrdersModel.js"
import Product from "../DataBase/models/ProductModel.js"
const stringToFloat = (s, d) => {
    let float = parseFloat(s)

    if (isNaN(float) || float <= 0) {
        page = d
    }
    return float
}

export const getAllOrders = asyncHandler(async (req, res, next) => {
    const { limit, skip, page, size } = req.pagination
    let { minTotalPrice, maxTotalPrice, sort, status, userId } = req.query

    minTotalPrice = stringToFloat(minTotalPrice, 0)
    maxTotalPrice = stringToFloat(maxTotalPrice, Infinity)
    const filterObj = {}
    filterObj.totalprice["$gte"] = minTotalPrice
    filterObj.totalprice["$lte"] = maxTotalPrice
    if (status) filterObj.status = status

    sort = sort.split(",").join(" ")

    if (req.user.role == "admin") {
        // admin can access all orders for all users
        if (userId) filterObj.userId = userId
    } else {
        // user only can access thier orders
        filterObj.userId = req.user._id
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
    const productIds = items.map((item) => {
        productIdsQuantityMap[item.product] = item.quantity
        return item.product
    })

    const products = await Product.find(
        { _id: { $in: productIds } },
        { price: 1 }
    )
    const totalPrice = products.reduce(
        (acc, item) => (acc += item.price * productIdsQuantityMap[item._id])
    )

    res.send(totalPrice)

})
export const getOrderDetails = asyncHandler(async (req, res, next) => {})
export const updateOrder = asyncHandler(async (req, res, next) => {})
export const deleteOrder = asyncHandler(async (req, res, next) => {})

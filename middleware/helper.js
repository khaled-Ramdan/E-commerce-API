// pagination.js
export const paginationMiddleware = (req, res, next) => {
    let { page = 1, size = 10 } = req.query

    page = parseInt(page, 10)
    size = parseInt(size, 10)

    if (isNaN(page) || page <= 0) {
        page = 1
    }

    if (isNaN(size) || size <= 0) {
        size = 10
    }

    req.pagination = {
        page,
        size,
        skip: (page - 1) * size,
        limit: size,
    }

    next()
}

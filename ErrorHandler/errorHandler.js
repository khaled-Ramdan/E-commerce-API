import AppError from "./appError.js"

const sendResponse = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        err,
        stack: process.env.IN_PRODUCTION ? undefined : err.stack,
    })
}

const handleCastError = function (error) {
    return new AppError(`Invalid ${error.path} : ${error.value}`, 400)
}

const handleValidationError = function (error) {
    const obj = Object.values(error.errors).map((el) => el.message)
    const message = obj.join(". ")
    return new AppError(message, 400)
}

const handleDuplicateKeyError = function (error) {
    // find the duplicated value
    const x = error.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]

    return new AppError(
        `Duplicate value .${x} , please enter another value.`,
        400
    )
}

export const globalErrorrHandling = function (err, req, res, next) {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"
    let error = { ...err }

    // HANDLE CAST ERROR
    if (err.name === "CastError") {
        error = handleCastError(err)
        return sendResponse(res, error)
    }

    // HANDLE DUPLICATE KEYS ERRORS
    if (err.code === 11000) {
        error = handleDuplicateKeyError(err)
        return sendResponse(res, error)
    }

    // HANDLE VALIDATION ERRORS
    if (err.name === "ValidationError") {
        error = handleValidationError(err)
        return sendResponse(res, error)
    }

    // FOR OTHER ERRORS
    sendResponse(res, err)
}

export const cathcAsync = function (fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

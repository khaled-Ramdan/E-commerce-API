import YAML from "yamljs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const swaggerUsers = YAML.load(
    path.join(__dirname, "./swagger-users.yaml")
)
const swaggerProducts = YAML.load(
    path.join(__dirname, "./swagger-products.yaml")
)
const swaggerCategories = YAML.load(
    path.join(__dirname, "./swagger-categories.yaml")
)
const swaggerOrders = YAML.load(path.join(__dirname, "./swagger-orders.yaml"))

const swaggerCart = YAML.load(path.join(__dirname, "./swagger-cart.yaml"))

const swaggerReviews = YAML.load(path.join(__dirname, "./swagger-reviews.yaml"))

const swaggerPayment= YAML.load(path.join(__dirname, "./swagger-payment.yaml"))

const uploadfiles = YAML.load(
    path.join(__dirname, "./swagger-upload-files.yaml")
)

export const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "E-commerce API Documentation",
        description: "This is a documentation for the E-commerce API project",
        version: "1.0.0",
    },
    tags: [
        {
            name: "User Routes", // Change this to your desired tag name
            description:
                "Routes for user authentication and admins accessible operations",
        },
        {
            name: "Products Routes",
            description: "Routes for Products CRUD operations",
        },
        {
            name: "Categories Routes",
            description: "Routes for Categories CRUD operations",
        },
        {
            name: "Orders Routes",
            description: "Routes for Orders CRUD operations",
        },
        {
            name: "Cart Routes",
            description: "Routes for Orders CRUD operations",
        },
        {
            name: "Reviews Routes",
            description: "Routes for Reviews CRUD operations",
        },
        {
            name: "Payment Routes",
            description: "Routes for Reviews CRUD operations",
        },
        {
            name: "Upload files Routes",
            description: "Routes for uplodating files and images",
        },
    ],
    components: {
        securitySchemes: {
            Authorization: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                value: "Bearer <JWT token here>",
            },
        },
    },
    paths: {
        ...swaggerUsers.paths,
        ...swaggerProducts.paths,
        ...swaggerCategories.paths,
        ...swaggerOrders.paths,
        ...swaggerCart.paths,
        ...swaggerReviews.paths,
        ...swaggerPayment.paths,
        ...uploadfiles.paths,
    },
}

export const swaggerOptions = {
    swaggerOptions: {
        docExpansion: "none", // This line makes the default list closed
    },
}


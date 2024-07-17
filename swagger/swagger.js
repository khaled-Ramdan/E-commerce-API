import YAML from "yamljs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const swaggerUsers = YAML.load(path.join(__dirname, "./swagger-users.yaml"))
const swaggerProducts = YAML.load(
    path.join(__dirname, "./swagger-products.yaml")
)
const uploadfiles = YAML.load(
    path.join(__dirname, "./swagger-upload-files.yaml")
)

const swaggerDocument = {
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
            description:
                "Routes for Products CRUD operations",
        },
        {
            name: "Upload files Routes", 
            description:
                "Routes for uplodating files and images",
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
        ...uploadfiles.paths,
    },
}

export default swaggerDocument

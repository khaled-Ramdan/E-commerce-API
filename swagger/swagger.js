import YAML from "yamljs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const swaggerUsers = YAML.load(path.join(__dirname, "./swagger-users.yaml"))
const swaggerProducts = YAML.load(
    path.join(__dirname, "./swagger-products.yaml")
)

const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "E-commerce API Documentation",
        description: "This is a documentation for the E-commerce API project",
        version: "1.0.0",
    },
    paths: {
        ...swaggerUsers.paths,
        ...swaggerProducts.paths,
    },
}

export default swaggerDocument

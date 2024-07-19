### Possible Routes

#### Authentication and User Management
- **POST** `/api/register`: Register a new user
- **POST** `/api/login`: Log in an existing user
- **POST** `/auth/google`: Continue with google credentials
- **POST** `/api/logout`: Log out the current user
- **GET** `/api/users`: Get a list of users (admin only)
- **GET** `/api/users/:id`: Get user details by ID (admin only)
- **PUT** `/api/users/:id`: Update user details 
- **DELETE** `/api/users/:id`: Delete a user (admin only)

#### Product Management
- **GET** `/api/products`: Get a list of products
- **GET** `/api/products/:id`: Get product details by ID
- **POST** `/api/products`: Add a new product (admin only)
- **PUT** `/api/products/:id`: Update product details (admin only)
- **DELETE** `/api/products/:id`: Delete a product (admin only)

#### Categories
- **GET** `/api/categories`: Get a list of categories
- **GET** `/api/categories/:id`: Get category details by ID
- **POST** `/api/categories`: Add a new category (admin only)
- **PUT** `/api/categories/:id`: Update category details (admin only)
- **DELETE** `/api/categories/:id`: Delete a category (admin only)

#### Orders
- **GET** `/api/orders`: Get a list of orders [all users for admins, your orders for user]
- **GET** `/api/orders/:id`: Get order details by ID
- **POST** `/api/orders`: Place a new order
- **PUT** `/api/orders/:id`: Update pending order for user
- **DELETE** `/api/orders/:id`: Cancel pending order for user

#### Cart
- **GET** `/api/cart`: Get the current user's cart
- **POST** `/api/cart`: Add an item to the cart
- **PUT** `/api/cart/:itemId`: Update cart item quantity
- **DELETE** `/api/cart/:itemId`: Remove an item from the cart

#### Reviews
- **GET** `/api/products/:id/reviews`: Get reviews for a product
- **POST** `/api/products/:id/reviews`: Add a review for a product
- **PUT** `/api/products/:id/reviews/:reviewId`: Update a review
- **DELETE** `/api/products/:id/reviews/:reviewId`: Delete a review

#### File Uploads 
- **GET** `/api/files`: get uploaded files
- **POST** `/api/upload`: upload a new file

### Database Schemas

#### User Schema
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "password": "String",
  "address": {
    "street": "String",
    "city": "String",
    "state": "String",
    "zip": "String",
    "country": "String"
  },
  "role": {
    "type": "String",
    "enum": ["user", "admin"],
    "default": "user"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### Product Schema
```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "price": "Number",
  "category": "ObjectId (reference to Category)",
  "stock": "Number",
  "images": ["ObjectId (reference to Image)"],
  "createdAt": "Date",
  "updatedAt": "Date",
  "brand": "string",
  "numReviews": "Number"
}
```

#### Category Schema
```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### Order Schema
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (reference to User)",
  "items": [
    {
      "product": "ObjectId (reference to Product)",
      "quantity": "Number"
    }
  ],
  "totalPrice": "Number",
  "shippingAddress": {
    "street": "String",
    "city": "String",
    "state": "String",
    "zip": "String",
    "country": "String"
  },
  "status": {
    "type": "String",
    "enum": ["pending", "shipped", "delivered", "cancelled"],
    "default": "pending"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### Cart Schema
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (reference to User)",
  "items": [
    {
      "product": "ObjectId (reference to Product)",
      "quantity": "Number"
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### Review Schema
```json
{
  "_id": "ObjectId",
  "product": "ObjectId (reference to Product)",
  "user": "ObjectId (reference to User)",
  "rating": {
    "type": "Number",
    "min": 1,
    "max": 5
  },
  "comment": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### Image Schema
```json
{
  "_id": "ObjectId",
    "name": "String",
    "img": {
        "data": "Buffer",
        "contentType": "String",
    },
}
```

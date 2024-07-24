## Possible Routes

#### Authentication and User Management
- **POST** `/api/register`: Register a new user
- **POST** `/api/login`: Log in an existing user
- **POST** `/auth/google`: Continue with google credentials
- **POST** `/api/logout`: Log out the current user
- **GET** `/api/users`: Get a list of users (admin only)
- **GET** `/api/users/:id`: Get user details by ID (admin only)
- **PUT** `/api/users/:id`: Update user details 
- **DELETE** `/api/users/:id`: Delete a user (admin only)

##### User Routes Demo:

https://github.com/user-attachments/assets/091db995-8a78-4f81-98f4-58c5c92cc32e






#### Product Management
- **GET** `/api/products`: Get a list of products
- **GET** `/api/products/:id`: Get product details by ID
- **POST** `/api/products`: Add a new product (admin only)
- **PUT** `/api/products/:id`: Update product details (admin only)
- **DELETE** `/api/products/:id`: Delete a product (admin only)
- 
##### Products Routes Demo:


https://github.com/user-attachments/assets/f7271ca0-f98b-4f52-9d06-6a3b196f2cc6



#### Categories
- **GET** `/api/categories`: Get a list of categories
- **GET** `/api/categories/:id`: Get category details by ID
- **POST** `/api/categories`: Add a new category (admin only)
- **PUT** `/api/categories/:id`: Update category details (admin only)
- **DELETE** `/api/categories/:id`: Delete a category (admin only)

##### Categories Routes Demo:


https://github.com/user-attachments/assets/685d959d-4abf-45a8-9337-576aa5695e9c


#### Orders
- **GET** `/api/orders`: Get a list of orders [all users for admins, your orders for user]
- **GET** `/api/orders/:id`: Get order details by ID
- **POST** `/api/orders`: Place a new order
- **PUT** `/api/orders/:id`: Update pending order for user
- **DELETE** `/api/orders/:id`: Cancel pending order for user
##### Orders Routes Demo:


https://github.com/user-attachments/assets/4d7b7e44-3aff-4c73-8278-2539651c6ae1


#### Cart
- **GET** `/api/cart`: Get the current user's cart
- **POST** `/api/cart`: Add an item to the cart
- **PUT** `/api/cart/:itemId`: Update cart item quantity
- **DELETE** `/api/cart/:itemId`: Remove an item from the cart

##### Cart Routes Demo:
  

https://github.com/user-attachments/assets/16f6a1d3-4154-459c-9f7f-7b953344224e


#### Reviews
- **GET** `/api/products/:id/reviews`: Get reviews for a product
- **POST** `/api/products/:id/reviews`: Add a review for a product
- **PUT** `/api/products/:id/reviews/:reviewId`: Update a review
- **DELETE** `/api/products/:id/reviews/:reviewId`: Delete a review

##### Reviews Routes Demo:


https://github.com/user-attachments/assets/8aacfd98-8a55-45ab-8231-05bd4ce01f82


#### Payment
- **GET** `/api/payment/:orderId/pay`: get uploaded files

#### File Uploads 
- **GET** `/api/files`: get uploaded files
- **POST** `/api/upload`: upload a new file

##### File Uploads Routes Demo:


https://github.com/user-attachments/assets/a6ea039b-f1a4-4c99-965a-d76c04d01172



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


# E-commerce Application Setup Guide

This guide will help you set up the environment variables required to run the E-commerce application on your local machine.

## Prerequisites

- Node.js and npm installed
- MongoDB Atlas account for the database
- Redis account for caching
- Stripe account for payment processing
- Google Developer account for authentication
- Email service account for sending emails

## Setting Up Environment Variables

Create a `.env` file in the root directory of your project and add the following environment variables:

### Server Parameters

```plaintext
PORT = {replace with port}
SERVER_URL = http://localhost:{PORT}
UI_ORIGIN =http://localhost:{frontend port}
```

### database parameters
```plaintext
DATABASE_HOST_LINK = {mongoDB connection link}
DATABASE_PASSWORD = {mongoDB password}
```

### jsonwebtoken authentication
```plaintext
JWT_SECRET = {secret value for jsonwebtoken}
JWT_EXPIRE_TIME = {time of expiration}
```
### google authentication
```plaintext
CALL_BACK_URL = {SERVER_URL}/google/callback
GOOGLE_CLIENT_ID = {client id for google authentication}
GOOGLE_CLIENT_SECRET = {google client secert}
EXPRESS_SESSION_SECRET = {express session secert}
```

### Redis authentication
```plaintext
REDIS_PASSWORD = {your redis database password}
REDIS_HOST = {redis host}
REDIS_PORT = {redis port}
```
### Stripe for payments
```plaintext
STRIPE_PRIVATE_KEY = {stripe private api key for development}
STRIPE_WEBHOOK_SECRET = {webhook secret}
```

### Email Sender
```plaintext
EMAIL ={sender email}
EMAIL_PASSWORD = {email password}
EMAIL_SERVICE = {email service. ex: gmail, outlook }
```

## Install dependencies and run project

### Install dependencies command
```bash
npm install
```

### Start server command
```bash
npm install
```

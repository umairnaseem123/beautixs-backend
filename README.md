# Beautixs Backend

Node.js / Express / MongoDB backend for Beautixs — a skincare & makeup e-commerce store. Includes JWT authentication, role-based admin access, product/category/order/review/blog management, and an admin dashboard stats endpoint.

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT auth + bcrypt password hashing
- CORS, Morgan logging

## Project Structure
```
beautixs-backend/
├── server.js                 → entry point
├── config/db.js              → MongoDB connection
├── models/                   → Mongoose schemas
├── routes/                   → Express routers
├── controllers/               → route handler logic
├── middleware/
│   ├── authMiddleware.js     → verifyToken + isAdmin
│   └── errorMiddleware.js    → 404 + centralized error handler
├── utils/                    → asyncHandler, generateToken
└── seed/dummyData.js         → seeds categories, products, admin user
```

## Setup

1. Install dependencies
   ```bash
   npm install
   ```

2. Configure environment variables — copy `.env.example` to `.env` and fill in values:
   ```bash
   cp .env.example .env
   ```
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/beautixs
   JWT_SECRET=change_this_to_a_long_random_secret
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:3000
   ```

3. Seed the database with dummy categories, products, and an admin user
   ```bash
   npm run seed
   ```
   Admin login after seeding: `admin@beautixs.com` / `Admin@12345`

   To wipe seeded data: `npm run seed:destroy`

4. Run the server
   ```bash
   npm run dev      # with nodemon (auto-restart)
   npm start        # plain node
   ```

Server runs at `http://localhost:5000` by default. Health check: `GET /api/health`.

## Auth

Send the JWT in the `Authorization` header on protected routes:
```
Authorization: Bearer <token>
```

| Method | Route             | Access  | Description              |
|--------|--------------------|---------|--------------------------|
| POST   | /api/auth/register | Public  | Register a new customer  |
| POST   | /api/auth/login     | Public  | Login, returns JWT       |
| GET    | /api/auth/me         | Private | Get own profile          |
| PUT    | /api/auth/me         | Private | Update own profile       |

## Products

| Method | Route              | Access       | Description                          |
|--------|---------------------|--------------|---------------------------------------|
| GET    | /api/products         | Public       | List products (filter/search/paginate) |
| GET    | /api/products/:id     | Public       | Get product by ID or slug            |
| POST   | /api/products         | Admin        | Create product                       |
| PUT    | /api/products/:id     | Admin        | Update product                       |
| DELETE | /api/products/:id     | Admin        | Delete product                       |

Query params for `GET /api/products`: `type`, `category`, `concern`, `subtype`, `brand`, `skinType`, `minPrice`, `maxPrice`, `search`, `sort` (`price_asc`/`price_desc`/`rating`/`newest`), `featured`, `page`, `limit`.

## Categories

| Method | Route               | Access | Description                        |
|--------|----------------------|--------|-------------------------------------|
| GET    | /api/categories        | Public | List categories (`?type=skincare\|makeup`) |
| GET    | /api/categories/:id    | Public | Get category by ID or slug         |
| POST   | /api/categories        | Admin  | Create category                    |
| PUT    | /api/categories/:id    | Admin  | Update category                    |
| DELETE | /api/categories/:id    | Admin  | Delete category (blocked if products still assigned) |

## Orders

| Method | Route                       | Access  | Description                       |
|--------|------------------------------|---------|-------------------------------------|
| POST   | /api/orders                    | Private | Create order (validates & decrements stock) |
| GET    | /api/orders/myorders            | Private | Get logged-in user's orders       |
| GET    | /api/orders/:id                | Private | Get single order (owner or admin) |
| PUT    | /api/orders/:id/pay             | Private | Mark order as paid                |
| GET    | /api/orders                    | Admin   | Get all orders (`?status=`)       |
| PUT    | /api/orders/:id/status          | Admin   | Update order status               |
| GET    | /api/orders/dashboard/stats    | Admin   | Total sales, total orders, top-selling products, orders by status |

## Users (Admin)

| Method | Route          | Access | Description         |
|--------|-----------------|--------|----------------------|
| GET    | /api/users        | Admin  | List users (`?role=`) |
| GET    | /api/users/:id    | Admin  | Get user by ID       |
| PUT    | /api/users/:id    | Admin  | Update user role/status |
| DELETE | /api/users/:id    | Admin  | Delete user          |

## Reviews

| Method | Route                              | Access  | Description                  |
|--------|--------------------------------------|---------|-------------------------------|
| GET    | /api/reviews/product/:productId        | Public  | Get approved reviews for a product |
| POST   | /api/reviews/product/:productId        | Private | Add a review (one per user per product) |
| PUT    | /api/reviews/:id                      | Private | Update own review            |
| DELETE | /api/reviews/:id                      | Private | Delete own review (or admin) |
| GET    | /api/reviews                          | Admin   | List all reviews (moderation) |

Product `rating` and `numReviews` are automatically recalculated whenever a review is created, updated, or deleted.

## Blog

| Method | Route            | Access | Description                     |
|--------|-------------------|--------|-----------------------------------|
| GET    | /api/blog           | Public | List published posts (`?category=`, `?tag=`) |
| GET    | /api/blog/:id       | Public | Get post by ID or slug          |
| GET    | /api/blog/admin     | Admin  | List all posts including drafts |
| POST   | /api/blog           | Admin  | Create post                     |
| PUT    | /api/blog/:id       | Admin  | Update post                     |
| DELETE | /api/blog/:id       | Admin  | Delete post                     |

## Notes
- All list endpoints for products/categories return `{ success, data, ... }` shaped JSON.
- Errors are returned as `{ success: false, message }` via the central error handler.
- Product and category `slug` fields are auto-generated with `slugify`.
- Passwords are hashed with bcrypt before saving; `password` is excluded from queries by default (`select: false`).

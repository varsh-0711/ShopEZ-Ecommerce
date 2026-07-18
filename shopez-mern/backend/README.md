# ShopEZ Backend

Node.js + Express + MongoDB backend for the ShopEZ frontend. Replaces the frontend's
in-memory mock data (hardcoded `PRODUCTS`, `USERS`, and React state) with a real,
persistent API.

## Setup

```bash
npm install
cp .env.example .env       # then edit MONGO_URI / JWT_SECRET as needed
npm run seed                # loads the 19 original products + 2 demo accounts
npm run dev                  # starts on http://localhost:5000 (nodemon)
# or: npm start
```

Requires a running MongoDB instance (local or Atlas) at the URI in `.env`.

## Demo accounts (created by `npm run seed`)

| Role  | Email              | Password |
|-------|--------------------|----------|
| User  | demo@shopez.com    | demo123  |
| Admin | admin@shopez.com   | admin123 |

## Auth

All protected routes expect:
```
Authorization: Bearer <token>
```
Token is returned from `/api/auth/login` and `/api/auth/register`.

## API Reference

### Auth
| Method | Route              | Access  | Description               |
|--------|---------------------|---------|----------------------------|
| POST   | /api/auth/register  | Public  | Create account, returns token |
| POST   | /api/auth/login      | Public  | Login, returns token       |
| GET    | /api/auth/me         | Private | Current user profile       |

### Products
| Method | Route                        | Access       | Description |
|--------|-------------------------------|--------------|-------------|
| GET    | /api/products                 | Public       | List/search/filter/sort/paginate |
| GET    | /api/products/:id              | Public       | Single product |
| GET    | /api/products/meta/categories  | Public       | Category list |
| POST   | /api/products                  | Admin        | Create product |
| PUT    | /api/products/:id               | Admin        | Update product |
| DELETE | /api/products/:id               | Admin        | Delete product |

`GET /api/products` query params: `search, category, brand, minPrice, maxPrice, tag, sort (priceLow|priceHigh|rating|discount), page, limit`

### Cart (server-persisted, mirrors frontend `cart` state)
| Method | Route              | Access  |
|--------|---------------------|---------|
| GET    | /api/cart            | Private |
| POST   | /api/cart            | Private | body: `{ productId, selectedSize, qty }` |
| PUT    | /api/cart/:productId  | Private | body: `{ qty, selectedSize }` |
| DELETE | /api/cart/:productId  | Private | query: `?selectedSize=` |
| DELETE | /api/cart             | Private | clears cart |

### Wishlist
| Method | Route                    | Access  |
|--------|---------------------------|---------|
| GET    | /api/wishlist              | Private |
| POST   | /api/wishlist/:productId    | Private | toggles in/out |
| DELETE | /api/wishlist/:productId    | Private |

### Orders (mirrors the frontend's checkout + tracking flow)
| Method | Route                  | Access  | Description |
|--------|--------------------------|---------|-------------|
| POST   | /api/orders               | Private | Place order from current cart |
| GET    | /api/orders                | Private | List my orders |
| GET    | /api/orders/:id              | Private | Order detail |
| PATCH  | /api/orders/:id/track         | Private | Advance status (confirmed → processing → shipped → delivered) |
| PATCH  | /api/orders/:id/cancel         | Private | Cancel (restocks items) |

`POST /api/orders` body: `{ address, paymentMethod: "upi"|"card"|"netbanking"|"cod", upiId?, cardNumber?, cardExpiry?, cardCvv?, selectedBank? }`
— validation matches the frontend's `placeOrder()` exactly.

### Admin
| Method | Route                          | Access | Description |
|--------|----------------------------------|--------|-------------|
| GET    | /api/admin/overview                | Admin  | Revenue/orders/products/users summary |
| GET    | /api/admin/orders                   | Admin  | All orders |
| PATCH  | /api/admin/orders/:id/status          | Admin  | body: `{ status }` |
| GET    | /api/admin/users                     | Admin  | All users |
| PATCH  | /api/admin/users/:id/role              | Admin  | body: `{ role }` |
| PATCH  | /api/admin/users/:id/deactivate         | Admin  | Toggle active/banned |
| GET    | /api/admin/analytics                  | Admin  | Sales by category, revenue by day |

## Notes on wiring up the existing frontend

The current `ShopEZ.html` keeps everything in React state (`useState`) with no
network calls. To connect it to this backend you'd replace:
- `PRODUCTS` constant → `fetch('/api/products')`
- `USERS` + `LoginModal`'s `handle()` → `fetch('/api/auth/login' | '/api/auth/register')`, store the returned `token` (e.g. in a React context/state, not localStorage inside the artifact preview but fine in a real deployed app)
- `cart` / `wishlist` state → the `/api/cart` and `/api/wishlist` endpoints (or keep them client-side and only sync at checkout — either works)
- `placeOrder()` → `POST /api/orders`
- `AdminPage` tables → the `/api/admin/*` endpoints

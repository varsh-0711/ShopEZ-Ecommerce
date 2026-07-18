# ShopEZ – Full MERN Stack E-Commerce Platform

A complete rebuild of ShopEZ as a genuine **MERN stack** application:

- **M**ongoDB — product, user, order data (via Mongoose)
- **E**xpress.js — REST API backend
- **R**eact — real Vite-based React project (component files, JSX, proper build tooling — not a single CDN-loaded HTML file)
- **N**ode.js — backend runtime

Same design, same features, same product catalog as before — now properly
split into a real React frontend project talking to a real Express/MongoDB
backend over REST APIs, instead of hardcoded mock data in one HTML file.

```
shopez-mern/
├── frontend/                 ← Vite + React project
│   ├── src/
│   │   ├── main.jsx           entry point
│   │   ├── App.jsx            root component + page routing
│   │   ├── context/           AppContext.jsx — global state, wired to the API
│   │   ├── api/                axios calls to the backend (auth, products, cart, wishlist, orders, admin)
│   │   ├── components/        Navbar, ProductCard, LoginModal, etc.
│   │   ├── pages/              Home, Search, ProductDetail, Cart, Wishlist, Orders, Account, Admin
│   │   ├── data/                static category/banner data
│   │   └── index.css
│   ├── package.json
│   └── .env.example
└── backend/                  ← Node.js + Express + MongoDB API
    ├── server.js
    ├── models/ controllers/ routes/ middleware/ seed/
    ├── package.json
    └── .env.example
```

## Running it locally

### 1. Backend
```bash
cd backend
npm install
copy .env.example .env      (Windows)   /   cp .env.example .env   (Mac/Linux)
npm run seed                 # loads the 19 products + demo accounts into MongoDB
npm run dev                   # API on http://localhost:5000
```
Requires MongoDB running locally (or a MONGO_URI to MongoDB Atlas) in `.env`.

### 2. Frontend
```bash
cd frontend
npm install
copy .env.example .env      (Windows)   /   cp .env.example .env   (Mac/Linux)
npm run dev                   # app on http://localhost:3000
```

Open `http://localhost:3000` in your browser. Make sure the backend (step 1)
is running first, since the frontend fetches products/auth/orders from it.

## Demo accounts

| Role  | Email              | Password |
|-------|--------------------|----------|
| User  | demo@shopez.com    | demo123  |
| Admin | admin@shopez.com   | admin123 |

## What changed from the single-HTML-file version

- The old `PRODUCTS` / `USERS_DB` hardcoded arrays are gone — products are
  fetched from `GET /api/products`, and auth goes through
  `POST /api/auth/login` / `register` with real JWT tokens + bcrypt-hashed
  passwords.
- Cart and wishlist persist in MongoDB for logged-in users (via `/api/cart`
  and `/api/wishlist`) instead of resetting on every page refresh.
- Placing an order calls `POST /api/orders`, which validates payment details
  server-side, decrements stock, and stores the order permanently — the
  Orders page and admin dashboard both read real data back from MongoDB.
- The admin dashboard's Overview, Orders, Users, and Products sections
  now show live data pulled from the backend, and the "Del" button on
  products actually deletes from the database.
- The single 2,100-line `index.html` file has been split into ~25 proper
  React component/page/context/API files under `frontend/src/`.

## Notes

- The "Add Product" and "Edit" buttons in the admin Products table are
  present but not wired to a form yet — the backend supports full CRUD
  (`POST`/`PUT`/`DELETE /api/products`), so this is a natural next step if
  needed.
- The Analytics tab's "Top Selling Products" is real data (from the product
  catalog); the original app's animated bar/pie charts were illustrative
  mock visuals and were kept as-is for now, but the backend's
  `GET /api/admin/analytics` endpoint already returns real sales-by-category
  and revenue-by-day aggregates if you'd like to wire them in.

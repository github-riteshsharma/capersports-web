
# Caper Sports - Premium Athletic Wear E-commerce Platform

A full-stack MERN e-commerce platform for premium sports clothing, featuring a modern UI/UX, admin dashboard, payment processing, MongoDB persistence, Cloudinary media storage, and one-click deployment to Render.

![Caper Sports](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-4EA94B)
![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5)
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7)

---

## 📚 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Local Development](#-local-development)
- [Environment Variables](#-environment-variables)
- [Deploying to Render](#-deploying-to-render)
- [API Endpoints](#-api-endpoints)
- [Troubleshooting](#-troubleshooting)
- [Security](#-security)
- [Contributing](#-contributing)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher and npm 9.x or higher
- A [MongoDB](https://www.mongodb.com/atlas) database (Atlas free tier works great)
- A [Cloudinary](https://cloudinary.com/) account (free tier) for image storage
- A [Stripe](https://stripe.com/) account (for payments, optional in dev)

### Local Installation

```bash
# Clone repository
git clone https://github.com/yourusername/capersports-web.git
cd capersports-web

# Install all dependencies (root, server, client)
npm run install-all
```

### Environment Setup

Copy the example env files and fill in your own values:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

See [Environment Variables](#-environment-variables) below for details on each value.

### Run the Application

```bash
# Run backend + frontend together (from the project root)
npm run dev
```

This starts:
- API server on `http://localhost:5001`
- React app on `http://localhost:3000`

---

## 📁 Project Structure

```
capersports-web/
├── client/                    # React frontend (Create React App + Tailwind)
│   ├── src/
│   │   ├── pages/             # Route-level pages (Home, Products, Admin, etc.)
│   │   ├── store/              # Redux Toolkit slices + API services
│   │   └── components/        # Shared UI components
│   └── .env.example
├── server/                    # Express API
│   ├── models/                # Mongoose models (User, Product, Order, Client)
│   ├── routes/                 # Express route handlers
│   ├── middleware/             # Auth middleware
│   ├── scripts/                # One-off/seed scripts
│   ├── server.js               # App entrypoint (serves API + built client)
│   └── .env.example
├── render.yaml                 # Render Blueprint for one-click deploy
└── package.json                 # Root scripts (dev/build/install-all)
```

---

## ✨ Features

- Product catalog with filtering, search, sorting, and pagination
- User authentication (JWT) with profile management and avatar uploads via Cloudinary
- Shopping cart, wishlist, and address book
- Order placement, tracking, cancellation, returns, and PDF invoices
- Stripe-powered checkout
- Admin dashboard: products, orders, users, invoices, and clients CRUD with analytics
- Responsive, animated UI built with Tailwind CSS and Framer Motion

---

## 🛠 Tech Stack

**Frontend:** React 18, Redux Toolkit, React Router 6, Tailwind CSS, Framer Motion, Axios

**Backend:** Node.js, Express, Mongoose (MongoDB), Cloudinary SDK, JWT, Multer, Stripe, Nodemailer

**Database:** MongoDB (Atlas or self-hosted)

**Media Storage:** Cloudinary

**Deployment:** Render (single Node web service serving both API and the built React app)

---

## 💻 Local Development

```bash
# Run both client and server concurrently
npm run dev

# Or run them separately:
npm run server   # nodemon server/server.js -> http://localhost:5001
npm run client   # react-scripts start -> http://localhost:3000
```

Useful server-side scripts (run from `server/`):

```bash
npm run seed:clients     # Seed sample "Clients" showcase data (requires an existing user)
npm run create-admin     # Create an admin user (requires ADMIN_EMAIL/ADMIN_PASSWORD env vars)
```

---

## 🔐 Environment Variables

### Server (`server/.env`)

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Port the API listens on (Render sets this automatically) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign auth tokens |
| `JWT_EXPIRE` | Token expiry, e.g. `30d` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials for image uploads |
| `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` | Stripe payment keys |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_EMAIL` / `SMTP_PASSWORD` | Outgoing email (order confirmations, etc.) |
| `FRONTEND_URL` / `CORS_ORIGIN` | Allowed origin(s) for CORS |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX_REQUESTS` | API rate limiting |

### Client (`client/.env`)

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Base URL of the API, e.g. `http://localhost:5001/api` |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

See `server/.env.example` and `client/.env.example` for full templates.

---

## 🚢 Deploying to Render

This repo ships with a `render.yaml` Blueprint that deploys the app as a **single Node web service**: it builds the React client and serves it (plus the API) from the Express server.

### Option A: Blueprint deploy (recommended)

1. Push this repo to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com/), click **New → Blueprint**, and select your repo.
3. Render will read `render.yaml` and create a `capersports-web` web service.
4. Fill in the required environment variables when prompted (or afterwards in **Environment**):
   - `MONGODB_URI`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` (if using payments)
   - `SMTP_*` (if sending emails)
   - `FRONTEND_URL` / `CORS_ORIGIN` – set to your Render service URL, e.g. `https://capersports-web.onrender.com`
   - `REACT_APP_API_URL` – set to `https://capersports-web.onrender.com/api` (needed at **build** time since it's baked into the React bundle)
5. Deploy. Render will run `npm run install-all && npm run build`, then start with `npm start`.
6. Verify with `GET https://<your-service>.onrender.com/api/health`.

### Option B: Manual Web Service

1. **New → Web Service**, connect your repo.
2. Build Command: `npm run install-all && npm run build`
3. Start Command: `npm start`
4. Add the same environment variables listed above.
5. Set the health check path to `/api/health`.

> Because the client is served by the same Express app (via `express.static` + SPA fallback in `server/server.js`), you don't need a separate static site service — one web service handles both the API and the frontend.

---

## 📡 API Endpoints

| Base path | Description |
|---|---|
| `POST /api/auth/register`, `/login`, `GET /me`, `PUT /profile`, `PUT /change-password`, `POST /upload-profile-picture` | Authentication & profile (avatar uploads via Cloudinary) |
| `GET /api/products`, `/featured`, `/categories`, `/categories/with-products`, `/brands`, `/:id`, review CRUD | Product catalog |
| `GET/POST /api/orders`, `/:id`, `/:id/cancel`, `/:id/return`, `/:id/invoice` | Orders |
| `GET/PUT /api/users/wishlist`, `/cart`, `/addresses` | User account data |
| `GET /api/admin/dashboard`, product/order/user CRUD | Admin dashboard |
| `GET/POST/PUT/DELETE /api/admin/invoices` | Invoices |
| `GET/POST/PUT/DELETE /api/clients` | Client showcase entries |
| `GET /api/health` | Health check (DB + storage status) |

---

## 🐛 Troubleshooting

- **`MongoDB connection error`** — double-check `MONGODB_URI`, and that your IP (or `0.0.0.0/0` for Render) is allow-listed in MongoDB Atlas Network Access.
- **Images fail to upload** — verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are set correctly.
- **CORS errors in the browser** — set `FRONTEND_URL`/`CORS_ORIGIN` on the server to match your deployed frontend URL.
- **Frontend calls `localhost` in production** — make sure `REACT_APP_API_URL` was set at **build time** (CRA inlines env vars during `npm run build`), then rebuild/redeploy.

---

## 🔒 Security

- Passwords hashed with bcrypt; JWT-based authentication with role-based (`user`/`admin`) authorization.
- `helmet`, `express-rate-limit`, and strict CORS configuration on the API.
- Never commit `.env` files or real credentials — use `.env.example` as a template and configure real secrets via your host's dashboard (e.g. Render's Environment tab).

---

## 🤝 Contributing

1. Fork the repo and create a feature branch.
2. Make your changes and ensure the app builds (`npm run build`) and the server starts (`npm start`) without errors.
3. Open a pull request describing your changes.

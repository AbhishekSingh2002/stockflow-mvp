# 📦 StockFlow MVP

A minimal multi-tenant SaaS inventory management system.

## Tech Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | Next.js 14, Tailwind CSS      |
| Backend  | Node.js, Express              |
| ORM      | Prisma                        |
| Database | PostgreSQL                    |
| Auth     | JWT + bcrypt                  |

---

## Prerequisites

- Node.js 18+
- PostgreSQL running locally (or a hosted DB URL)

---

## Setup

### 1. Clone & install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

Create `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/stockflow"
JWT_SECRET="your_super_secret_key"
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run DB migrations

```bash
cd backend
npx prisma db push       # fast push for development
# or
npx prisma migrate dev   # creates a migration file
```

### 4. Start servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open http://localhost:3000

---

## API Reference

### Auth
| Method | Endpoint          | Body                                          |
|--------|-------------------|-----------------------------------------------|
| POST   | /api/auth/signup  | email, password, organizationName             |
| POST   | /api/auth/login   | email, password                               |
| GET    | /api/auth/me      | —                                             |

### Products
| Method | Endpoint                          | Notes                      |
|--------|-----------------------------------|----------------------------|
| GET    | /api/products?search=             | Filter by name or SKU      |
| GET    | /api/products/:id                 |                            |
| POST   | /api/products                     | Create product             |
| PUT    | /api/products/:id                 | Full update                |
| PATCH  | /api/products/:id/adjust-stock    | Body: { delta, note }      |
| DELETE | /api/products/:id                 |                            |

### Dashboard
| Method | Endpoint        |
|--------|-----------------|
| GET    | /api/dashboard  |

### Settings
| Method | Endpoint       | Body                          |
|--------|----------------|-------------------------------|
| GET    | /api/settings  |                               |
| PUT    | /api/settings  | defaultLowStockThreshold (int) |

---

## Key Design Decisions

- **Prisma `$transaction`** on signup: org + user + settings are created atomically.
- **Singleton PrismaClient**: prevents connection pool exhaustion on hot reloads.
- **`Promise.all`** in dashboard and products page: parallel DB queries for speed.
- **JWT interceptor** in `api.js`: auto-attaches token and redirects on 401.
- **SKU uniqueness** scoped per organization (not globally).
- **`adjustStock` endpoint**: explicit delta-based stock mutation prevents race condition bugs vs. direct PUT.
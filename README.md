# 📦 StockFlow MVP

A minimal multi-tenant SaaS inventory management system built with modern web technologies.

## 🚀 Features

- **Multi-tenant Architecture** - Organizations with isolated data
- **User Authentication** - Secure JWT-based login/signup
- **Product Management** - Add, edit, delete products with SKU tracking
- **Inventory Tracking** - Real-time stock levels and low stock alerts
- **Dashboard Analytics** - Overview of inventory metrics
- **Dark Theme UI** - Modern, responsive interface
- **Search & Filter** - Find products quickly by name or SKU

## 🛠 Tech Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend  | Node.js, Express, dotenv      |
| ORM      | Prisma                        |
| Database | PostgreSQL                    |
| Auth     | JWT + bcrypt                  |
| HTTP Client | Axios                      |

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

## 🏗 Project Structure

```
stockflow-mvp/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── controllers/           # Route handlers
│   │   ├── middleware/            # Auth middleware
│   │   ├── routes/               # API routes
│   │   ├── utils/                # Prisma client
│   │   └── server.js             # Express server
│   ├── .env                      # Environment variables
│   └── package.json
├── frontend/
│   ├── pages/                    # Next.js pages
│   ├── components/               # React components
│   ├── services/                 # API client
│   ├── styles/                   # Global styles
│   └── package.json
└── README.md
```

## 🚀 Quick Start

1. **Prerequisites**: Node.js 18+, PostgreSQL
2. **Install**: `npm install` in both backend/ and frontend/
3. **Configure**: Copy `.env.example` to `.env` and update database URL
4. **Database**: `npx prisma db push`
5. **Run**: `npm run dev` in both directories
6. **Visit**: http://localhost:3000

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/stockflow_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
```

### Frontend (optional .env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### Common Issues

1. **Port 5000 already in use**
   ```bash
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. **Database connection failed**
   - Check PostgreSQL is running
   - Verify credentials in `.env`
   - Ensure database `stockflow_db` exists

3. **Prisma schema errors**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **MetaMask errors in browser**
   - These are from browser extensions and don't affect the app
   - Safe to ignore

## 📝 Development Notes

- **No API keys required** - Everything runs locally
- **Multi-tenant** - Data isolation per organization
- **JWT authentication** - Stateless auth with token interceptors
- **Real-time updates** - Stock adjustments reflect immediately
- **Responsive design** - Works on desktop and mobile

---

## 🏗 Key Design Decisions

- **Prisma `$transaction`** on signup: org + user + settings are created atomically.
- **Singleton PrismaClient**: prevents connection pool exhaustion on hot reloads.
- **`Promise.all`** in dashboard and products page: parallel DB queries for speed.
- **JWT interceptor** in `api.js`: auto-attaches token and redirects on 401.
- **SKU uniqueness** scoped per organization (not globally).
- **`adjustStock` endpoint**: explicit delta-based stock mutation prevents race condition bugs vs. direct PUT.
- **Environment-based configuration** - Uses `.env` for sensitive data
- **Error boundary handling** - Graceful fallbacks for API failures
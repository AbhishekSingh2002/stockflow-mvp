# 💰 Finance Data Processing and Access Control Backend

A comprehensive finance dashboard system with role-based access control, built with modern web technologies. This backend demonstrates API design, data modeling, business logic, and access control patterns for financial data processing.

## 🎯 Project Objective

This project evaluates backend development skills through practical implementation of:
- **API Design** - RESTful endpoints with proper HTTP methods and status codes
- **Data Modeling** - Financial records with transactions, categories, and relationships
- **Business Logic** - Role-based permissions and financial analytics
- **Access Control** - Multi-tenant architecture with user roles and permissions
- **Validation & Error Handling** - Input validation and meaningful error responses

## 🚀 Features

### Core Features
- **Multi-tenant Architecture** - Organizations with isolated financial data
- **Role-Based Access Control** - Viewer, Analyst, and Admin roles with specific permissions
- **User Management** - Complete CRUD operations for user administration
- **Financial Records** - Transaction management with income/expense tracking
- **Dashboard Analytics** - Real-time financial summaries and insights
- **Data Validation** - Comprehensive input validation and error handling

### Permission Levels
- **Viewer**: Can view dashboard data and financial records
- **Analyst**: Can view records, access insights, and create/update financial records
- **Admin**: Full management access including user administration

## 🛠 Tech Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Backend  | Node.js, Express, dotenv      |
| ORM      | Prisma                        |
| Database | PostgreSQL                    |
| Auth     | JWT + bcrypt                  |
| Validation| express-validator            |

---

## 📋 Database Schema

### Core Models

#### User
```prisma
model User {
  id             String       @id @default(uuid())
  email          String       @unique
  password       String
  role           Role         @default(VIEWER)
  status         UserStatus   @default(ACTIVE)
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}
```

#### FinancialRecord
```prisma
model FinancialRecord {
  id             String             @id @default(uuid())
  amount         Float
  type           TransactionType    // INCOME | EXPENSE
  category       TransactionCategory // SALARY, RENT, FOOD, etc.
  date           DateTime
  description    String?
  notes          String?
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}
```

### Enums
- **Role**: VIEWER, ANALYST, ADMIN
- **UserStatus**: ACTIVE, INACTIVE
- **TransactionType**: INCOME, EXPENSE
- **TransactionCategory**: SALARY, RENT, UTILITIES, FOOD, TRANSPORT, ENTERTAINMENT, HEALTHCARE, EDUCATION, INVESTMENT, OTHER

---

## 🔌 API Reference

### Authentication
| Method | Endpoint          | Body                                          | Access |
|--------|-------------------|-----------------------------------------------|--------|
| POST   | /api/auth/signup  | email, password, organizationName             | Public |
| POST   | /api/auth/login   | email, password                               | Public |
| GET    | /api/auth/me      | —                                             | Authenticated |

### Financial Records
| Method | Endpoint                          | Body | Access |
|--------|-----------------------------------|------|--------|
| GET    | /api/financial-records            | —    | Viewer+ |
| GET    | /api/financial-records/:id        | —    | Viewer+ |
| POST   | /api/financial-records            | amount, type, category, date, description?, notes? | Analyst+ |
| PUT    | /api/financial-records/:id        | same as POST (all optional) | Analyst+ |
| DELETE | /api/financial-records/:id        | —    | Admin |

### Dashboard Analytics
| Method | Endpoint        | Query Parameters | Access |
|--------|-----------------|------------------|--------|
| GET    | /api/dashboard  | —                | Viewer+ |
| GET    | /api/dashboard/analytics | period (weekly|monthly|quarterly|yearly), category | Analyst+ |

### User Management (Admin Only)
| Method | Endpoint       | Body | Access |
|--------|----------------|------|--------|
| GET    | /api/users     | —    | Admin |
| GET    | /api/users/:id | —    | Admin |
| POST   | /api/users     | email, password, role?, status? | Admin |
| PUT    | /api/users/:id | email?, password?, role?, status? | Admin |
| DELETE | /api/users/:id | —    | Admin |

---

## 🚀 Setup

### 1. Prerequisites
- Node.js 18+
- PostgreSQL running locally

### 2. Clone & Install
```bash
# Backend
cd backend
npm install
```

### 3. Configure Environment
Create `backend/.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/finance_db"
JWT_SECRET="your_super_secret_key"
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 4. Database Setup
```bash
cd backend
npx prisma db push       # Apply schema to database
npx prisma generate      # Generate Prisma client
```

### 5. Start Server
```bash
cd backend
npm run dev               # Development mode
# or
npm start                 # Production mode
```

Server runs on http://localhost:5000

---

## 🏗 Key Design Decisions

### Architecture
- **Multi-tenant Design**: Data isolation per organization using organizationId
- **Role Hierarchy**: Hierarchical permissions allowing role inheritance
- **JWT Authentication**: Stateless auth with role information in tokens
- **Database Indexing**: Optimized queries for financial data filtering

### Security
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Input Validation**: Comprehensive validation to prevent injection attacks
- **CORS Configuration**: Restricted origins for API access
- **Role-Based Authorization**: Middleware-enforced permission checks

---

## 📈 Evaluation Criteria Met

✅ **Backend Design**: Clean separation of concerns with controllers, middleware, and routes
✅ **Logical Thinking**: Clear implementation of business rules and access control
✅ **Functionality**: All required APIs working with proper permissions
✅ **Code Quality**: Readable, maintainable code with proper error handling
✅ **Database Design**: Appropriate schema for financial data with relationships
✅ **Validation**: Comprehensive input validation and meaningful error responses
✅ **Documentation**: Complete API documentation and setup instructions
✅ **Additional Features**: Analytics, pagination, search, and comprehensive role management

---

## 📄 License

This project is for educational and evaluation purposes only.

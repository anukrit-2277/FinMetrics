# FinMetrics — Finance Dashboard Backend

A full-stack finance dashboard system with role-based access control, financial records management, and analytics APIs. Built with **Node.js/Express**, **PostgreSQL**, and **Prisma ORM**.

> **Frontend**: React 19 (Vite) with a dark-themed dashboard UI  
> **Backend**: RESTful API with session-based authentication and RBAC

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Access Control Matrix](#access-control-matrix)
- [Design Decisions & Assumptions](#design-decisions--assumptions)
- [Tradeoffs](#tradeoffs)
- [Optional Enhancements Implemented](#optional-enhancements-implemented)

---

## Architecture

```
Client (React) ──► Express API ──► Service Layer ──► Prisma ORM ──► PostgreSQL
                       │
               ┌───────┼───────┐
          Middleware:   │       │
          • Auth        │       │
          • RBAC        │       │
          • Validation  │       │
          • Error       │       │
          Handler       │       │
```

The backend follows a **layered architecture**:

| Layer | Responsibility |
|-------|---------------|
| **Routes** | HTTP method mapping, middleware chaining |
| **Controllers** | Request/response handling, delegates to services |
| **Services** | Business logic, data processing, Prisma queries |
| **Middleware** | Auth, RBAC, validation, error handling (cross-cutting concerns) |
| **Validators** | express-validator rules for input sanitization |

---

## Tech Stack

| Component | Technology | Reason |
|-----------|-----------|--------|
| Runtime | Node.js 18+ | Industry standard, async I/O |
| Framework | Express.js | Lightweight, mature ecosystem |
| Database | PostgreSQL | ACID compliance, Decimal precision for financial data |
| ORM | Prisma | Type-safe queries, migrations, schema-as-code |
| Auth | express-session + bcrypt | Server-side sessions avoid JWT token management complexity |
| Validation | express-validator | Declarative, middleware-based validation |
| Logging | Morgan | HTTP request logging for development |

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # Database schema (Role, User, Transaction)
│   └── seed.js              # Seed script with test accounts
├── src/
│   ├── app.js               # Express app entry point
│   ├── config/
│   │   ├── db.js            # Prisma client singleton
│   │   └── session.js       # Session middleware config
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── transaction.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   ├── auth.js           # isAuthenticated check
│   │   ├── rbac.js           # Role-based access control
│   │   ├── errorHandler.js   # Global error handler
│   │   └── validate.js       # Validation middleware wrapper
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── transaction.routes.js
│   │   └── dashboard.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── transaction.service.js
│   │   └── dashboard.service.js
│   └── validators/
│       ├── auth.validator.js
│       ├── user.validator.js
│       └── transaction.validator.js
└── package.json
```

---

## Setup & Installation

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd FinMetrics

# 2. Backend setup
cd backend
npm install

# 3. Create .env file (see Environment Variables section)
cp .env.example .env

# 4. Run database migrations
npx prisma migrate dev --name init

# 5. Seed test data
node prisma/seed.js

# 6. Start the backend
npm run dev    # runs on http://localhost:5001

# 7. Frontend setup (separate terminal)
cd ../frontend
npm install
npm run dev    # runs on http://localhost:5173
```

### Test Accounts (Seeded)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@finmetrics.com | `Admin@2025!` |
| Analyst | analyst@finmetrics.com | `Analyst@2025!` |
| Viewer | viewer@finmetrics.com | `Viewer@2025!` |

---

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/finmetrics"
PORT=5001
SESSION_SECRET="your-session-secret-here"
NODE_ENV=development
```

---

## Database Schema

```
┌──────────────┐     ┌──────────────────┐     ┌────────────────────┐
│    roles     │     │      users       │     │   transactions     │
├──────────────┤     ├──────────────────┤     ├────────────────────┤
│ id (PK)      │◄────│ role_id (FK)     │◄────│ user_id (FK)       │
│ name (UNIQUE)│     │ id (PK)          │     │ id (PK)            │
│ created_at   │     │ email (UNIQUE)   │     │ amount (Decimal)   │
└──────────────┘     │ name             │     │ type (INCOME/EXP.) │
                     │ password (bcrypt)│     │ category           │
                     │ is_active        │     │ date               │
                     │ created_at       │     │ notes              │
                     │ updated_at       │     │ is_deleted (soft)  │
                     └──────────────────┘     │ created_at         │
                                              │ updated_at         │
                                              └────────────────────┘
```

**Key decisions:**
- `Decimal(12,2)` for amount — avoids floating-point precision errors in financial data
- `is_deleted` soft delete — preserves audit trail, transactions are never physically removed
- `bcrypt` with 12 salt rounds for password hashing

---

## API Documentation

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/login` | Login with email/password | No |
| `POST` | `/api/auth/logout` | Destroy session | Yes |
| `GET` | `/api/auth/me` | Get current user | Yes |
| `PUT` | `/api/auth/change-password` | Change password | Yes |

### Users (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/roles` | List all roles |
| `GET` | `/api/users/:id` | Get user by ID |
| `POST` | `/api/users` | Create user |
| `PUT` | `/api/users/:id` | Update user |
| `DELETE` | `/api/users/:id` | Deactivate user |

### Transactions

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/transactions` | List with filters + pagination | All |
| `GET` | `/api/transactions/categories` | Distinct categories | All |
| `GET` | `/api/transactions/:id` | Get by ID | All |
| `POST` | `/api/transactions` | Create | Admin |
| `PUT` | `/api/transactions/:id` | Update | Admin |
| `DELETE` | `/api/transactions/:id` | Soft delete | Admin |

**Query Parameters for `GET /api/transactions`:**

| Param | Type | Description |
|-------|------|-------------|
| `type` | string | Filter by INCOME or EXPENSE |
| `category` | string | Filter by category name |
| `startDate` | ISO date | Filter from date |
| `endDate` | ISO date | Filter to date |
| `search` | string | Search in category and notes |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |

### Dashboard Analytics

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/dashboard/summary` | Income, expenses, balance, count | All |
| `GET` | `/api/dashboard/recent` | Last 10 transactions | All |
| `GET` | `/api/dashboard/category-totals` | Category-wise breakdown | Analyst, Admin |
| `GET` | `/api/dashboard/trends` | Monthly income/expense trends (12 months) | Analyst, Admin |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | API status check |

---

## Access Control Matrix

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View dashboard summary | ✅ | ✅ | ✅ |
| View recent transactions | ✅ | ✅ | ✅ |
| View analytics (charts) | ❌ | ✅ | ✅ |
| View all transactions | ❌ | ✅ | ✅ |
| Create transaction | ❌ | ❌ | ✅ |
| Edit transaction | ❌ | ❌ | ✅ |
| Delete transaction | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| View own profile | ✅ | ✅ | ✅ |
| Change own password | ✅ | ✅ | ✅ |

**Enforcement**: RBAC is enforced at the **middleware level** via `authorize()`, not just in the UI. Even if a user bypasses the frontend, the API will reject unauthorized requests with `403 Forbidden`.

---

## Design Decisions & Assumptions

### 1. Session-based Auth over JWT
Sessions with `httpOnly` cookies were chosen over JWT because:
- Server can immediately invalidate sessions (vs JWT token expiry delay)
- No token storage/refresh logic needed on client
- Better suited for a monolithic dashboard app

### 2. Soft Delete for Transactions
Transactions use `is_deleted` flag instead of hard delete to preserve financial audit trail. Deleted records are excluded from all queries via the service layer.

### 3. Decimal(12,2) for Amounts
PostgreSQL `Decimal(12,2)` ensures financial precision. JavaScript `parseFloat` is only used for API responses — storage and aggregation use database-level decimal arithmetic.

### 4. Layered Architecture
Routes → Controllers → Services → Prisma keeps concerns separated:
- Routes handle HTTP concerns
- Controllers handle request/response
- Services contain business logic (testable independently)

### 5. Centralized Error Handling
All errors bubble up to `errorHandler.js` middleware, providing consistent error response format across all endpoints.

### 6. Password Security
- Passwords hashed with **bcrypt (12 salt rounds)**
- Strong password validation: min 8 chars, uppercase, lowercase, digit, special character
- Passwords never returned in API responses

---

## Tradeoffs

| Decision | Benefit | Tradeoff |
|----------|---------|----------|
| PostgreSQL over in-memory | Data persistence, real queries | Requires external DB setup |
| Prisma ORM | Schema-as-code, type safety | Additional abstraction layer |
| Session auth | Simple, secure, instant revocation | Requires server-side session store (not stateless) |
| Soft delete | Preserves audit trail | Slightly more complex queries |
| Single codebase (no microservices) | Simpler deployment, easier to understand | Less scalable for large teams |

---

## Optional Enhancements Implemented

| Enhancement | Status | Details |
|-------------|--------|---------|
| Authentication | ✅ | Session-based with bcrypt |
| Pagination | ✅ | Page/limit on transactions listing |
| Search | ✅ | Case-insensitive search on category and notes |
| Soft delete | ✅ | `is_deleted` flag on transactions |
| Rate limiting | ✅ | express-rate-limit on auth routes |
| Input validation | ✅ | express-validator with strong password rules |
| Change password | ✅ | Secure password change with old password verification |
| Health check endpoint | ✅ | `GET /api/health` |
| Frontend | ✅ | Full React dashboard with responsive dark theme |

---

## Running Tests

```bash
cd backend
npm test
```

---

## License

This project was built as part of a backend development assessment.

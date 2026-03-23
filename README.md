# My Shopping - Multi-Tenant SaaS Ecommerce

A production-ready, multi-tenant SaaS ecommerce platform built with modern technologies.

## Tech Stack

- **Monorepo**: Turborepo
- **Backend**: NestJS, Prisma, PostgreSQL, Redis, BullMQ
- **Frontend**: Next.js 14 (App Router), TailwindCSS, Zustand, React Query
- **DevOps**: Docker, Railway (backend), Vercel (frontend)

## Project Structure

```
/apps
  /api        → NestJS backend
  /web        → Next.js frontend
/packages
  /ui         → Shared UI components
  /config     → Shared configs
/infra
  docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm

### 1. Clone and install

```bash
git clone <repo-url>
cd my_shooping
npm install
```

### 2. Start infrastructure (PostgreSQL + Redis)

```bash
cd infra
docker compose up -d postgres redis
```

### 3. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### 4. Set up database

```bash
cd apps/api
npx prisma db push
npx ts-node prisma/seed.ts
```

### 5. Run development

```bash
# From root
npm run dev
```

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001

### Default credentials

- **Email**: admin@demo.com
- **Password**: admin123
- **Tenant ID** (header): use the tenant UUID or domain `demo`

## API Endpoints

All endpoints require `x-tenant-id` header.

| Method | Endpoint               | Auth | Description          |
|--------|------------------------|------|----------------------|
| POST   | /api/auth/login        | No   | Login                |
| POST   | /api/auth/register     | No   | Register             |
| GET    | /api/products          | No   | List products        |
| POST   | /api/products          | Admin| Create product       |
| PUT    | /api/products/:id      | Admin| Update product       |
| DELETE | /api/products/:id      | Admin| Delete product       |
| GET    | /api/orders            | Yes  | List orders          |
| POST   | /api/orders            | Yes  | Create order         |
| PATCH  | /api/orders/:id/status | Admin| Update order status  |
| GET    | /api/users             | Admin| List users           |
| POST   | /api/users             | Admin| Create user          |

## Docker (Full Stack)

```bash
cd infra
docker compose up -d
```

## Deployment

### Backend (Railway)

1. Connect your repo to Railway
2. Set root directory to `apps/api`
3. Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `REDIS_URL`
4. Railway auto-detects and deploys

### Frontend (Vercel)

1. Connect your repo to Vercel
2. Set root directory to `apps/web`
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

## Multi-Tenancy

Tenant is resolved via:
- `x-tenant-id` header (ID or domain)
- Subdomain extraction

All data is scoped to the resolved tenant.

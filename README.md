# TireOps AI

Tire industry full-stack smart platform with **enterprise-grade** 7 modules.

## Enterprise Features

| Feature | Description |
|---------|-------------|
| **PostgreSQL** | Production DB, Azure / self-hosted |
| **Auth** | NextAuth.js login, JWT session |
| **Roles** | ADMIN / USER (extensible) |
| **API rate limit** | 60 req/min/IP |
| **Azure ready** | Deployment docs, global access |

## Modules

| Module | Function |
|--------|----------|
| **Dashboard** | Production lines, QC, tread efficiency |
| **AI Quoting** | Tire quote, EU label, DOT/ECE |
| **Orders** | Order status: PRODUCTION / QC CHECK |
| **Email AI** | OEM / fleet / warranty scenarios |
| **Invoice AI** | Invoice, warranty, cert fee |
| **Tread Designer** | Tread design → AI analysis → CNC export |
| **Compound Spec** | phr formula, EU prediction |

## Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM
- **Database**: PostgreSQL (prod) / Docker (local)
- **Auth**: NextAuth.js v5 + bcrypt
- **AI**: OpenAI GPT-4o-mini

## Requirements

- **Node.js** >= 20.9.0
- **PostgreSQL** 16+ (Docker for local)

## Quick Start

### 1. Local PostgreSQL (Docker)

```bash
docker-compose up -d
```

### 2. Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure:
- `DATABASE_URL`: `postgresql://tireops:tireops_dev@localhost:5432/tireops`
- `AUTH_SECRET`: run `openssl rand -base64 32`
- `OPENAI_API_KEY`: optional

### 3. Database

```bash
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Run

```bash
npm run dev
```

Visit http://localhost:3000

**Default login**: `admin@tireops.com` / `admin123` (change in production)

## Free Demo Deployment (Recommended)

Zero DB cost: Neon free PostgreSQL + Azure Web App.

**Steps**: [docs/FREE_DEMO_SETUP.md](docs/FREE_DEMO_SETUP.md)

## Full Azure Deployment (with paid DB)

See [docs/AZURE_DEPLOYMENT.md](docs/AZURE_DEPLOYMENT.md)

Brief steps:
1. Create Azure Database for PostgreSQL
2. Create Web App (Node 20)
3. Configure env vars
4. Deploy via GitHub
5. Run `prisma migrate deploy` and `db:seed`

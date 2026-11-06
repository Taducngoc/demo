# EduBranch AI

Node.js workspace with a Next.js frontend, NestJS backend and SQL Server database.

## Run the frontend demo

Install Node.js 20 and npm, then run from the repository root:

```powershell
npm ci
npm run build:shared
npm run dev:frontend
```

Open http://localhost:3000. The frontend currently uses mock data; it is not a production authentication system.

## Configure the backend

Copy `.env.example` to `.env` at the repository root. Replace all password and secret placeholders with your own values. Use the same database password in `DATABASE_URL` and `MSSQL_SA_PASSWORD`. Generate independent random JWT secrets of at least 32 characters. Never commit `.env`.

Backend workspace commands load `.env` from `apps/backend`, so also copy your configured root `.env` to `apps/backend/.env`. Keep the two local files in sync.

With Docker installed, run from the repository root:

```powershell
docker compose up -d
npm exec --workspace=apps/backend -- prisma generate
npm run db:push --workspace=apps/backend
npm run seed
npm run dev:backend
```

Wait for SQL Server to be ready before running database commands. The seed requires `ADMIN_PASSWORD` and `SEED_USER_PASSWORD`; it does not provide default passwords. Live AI integrations require your own provider API key. The backend API documentation is at http://localhost:4000/api/docs.

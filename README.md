# Library Management System

A full-stack library management application for managing books, authors, physical copies, student accounts, and borrowing workflows. The application has separate student and librarian experiences.

## Project Status

The MVP implementation and Phase 13 end-to-end verification are complete. Phase 14 focuses on final documentation and repository cleanup.

## Features

### Authentication and access control
- Student self-registration and login.
- Librarian login using a provisioned account.
- JWT-based authentication.
- Role-based authorization enforced by the backend.
- Students can access only their own borrowing records.

### Student experience
- Browse and search the book catalogue.
- View book details, authors, and copy availability.
- View current borrowings, due dates, overdue status, and borrowing history.

### Librarian experience
- Create, view, update, and delete books when deletion is permitted.
- Create and update authors.
- Manage physical copies.
- View student records and borrowing history.
- Issue available copies and record returns.
- View summary metrics for titles, copies, availability, active borrowings, and overdue borrowings.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Routing and data fetching | React Router, TanStack Query, Axios |
| Forms and validation | React Hook Form, Zod |
| UI | Bootstrap, Bootstrap Icons |
| Backend | Node.js, Express, TypeScript |
| Database and ORM | PostgreSQL, TypeORM |
| Authentication | JWT (`jsonwebtoken`), bcrypt |
| Backend testing | Jest, Supertest |

## Architecture

The repository is organized into separate frontend and backend applications.

- `backend/src/modules/` contains feature modules for authentication, books, authors, physical copies, students, borrowings, and summary data.
- `backend/src/entities/` contains TypeORM entities.
- `backend/src/migrations/` contains versioned database migrations.
- `frontend/src/` contains the React application, pages, layouts, routing, services, schemas, and types.
- `docs/` contains requirements, database design, API design, frontend design, testing strategy, and end-to-end verification documentation.

The backend validates request data, hashes passwords, verifies JWTs, enforces role and ownership rules, and uses database constraints to protect borrowing integrity. Database schema changes are managed through migrations; TypeORM schema synchronization is disabled.

## Prerequisites

Install the following before starting:

- Node.js and npm versions compatible with the versions specified by the project dependencies.
- PostgreSQL.
- Git.

## Local Development Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd library-management-system
```

Replace `<repository-url>` with the URL of your repository.

### 2. Configure the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and set values appropriate for your local environment. At minimum, configure:

- `FRONTEND_ORIGIN` — normally `http://localhost:5173`.
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, and `DATABASE_PASSWORD`.
- `JWT_SECRET_KEY` — use a random secret of at least 32 characters.
- `INITIAL_LIBRARIAN_NAME`, `INITIAL_LIBRARIAN_EMAIL`, and `INITIAL_LIBRARIAN_PASSWORD` — use a strong local password of at least 10 characters.

Do not commit `.env` or real credentials.

In non-production environments, the backend can create the configured application database if it does not exist. On startup, it initializes TypeORM, runs committed migrations, and creates the initial librarian account if the configured email does not already exist. The PostgreSQL user must have the permissions needed for this local setup. Automatic database creation is disabled in production.

Start the backend development server:

```bash
npm run dev
```

The backend defaults to `http://localhost:3000`. Its health endpoint is:

```text
GET http://localhost:3000/health
```

Keep this terminal running.

### 3. Configure and start the frontend

In a second terminal, from the repository root:

```bash
cd frontend
npm install
cp .env.example .env
```

The default frontend environment values are:

```dotenv
VITE_API_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=10000
```

Change them if your backend uses a different URL or port. Then start Vite:

```bash
npm run dev
```

Open the local URL printed by Vite, typically `http://localhost:5173`.

## Verification Commands

Run commands from the relevant application directory.

### Backend

```bash
cd backend
npm run typecheck
npm test -- --runInBand
npm run build
npm run test:integration
```

The integration test command requires a correctly configured PostgreSQL test database and the environment needed by the integration suite.

Other available backend commands:

```bash
npm run test:watch
npm run migration:run
```

The backend runs migrations on startup as well. Use `npm run migration:run` when you specifically need to apply pending migrations manually.

### Frontend

```bash
cd frontend
npm run lint
npm run typecheck
npm run build
```

To preview a production build locally after building:

```bash
npm run preview
```

## API Overview

The API base path is `/api/v1`. The health endpoint is `GET /health`; application APIs include:

- `/api/v1/auth` — student registration and login.
- `/api/v1/books` — book catalogue and librarian book management.
- `/api/v1/authors` — author catalogue and librarian author management.
- `/api/v1/students` — librarian student management.
- Borrowing and physical-copy endpoints under `/api/v1`.
- `/api/v1/summary` — librarian summary metrics.

See [`docs/api-design.md`](docs/api-design.md) for endpoint details, request/response conventions, and access rules.

## Documentation

- [Requirements and scope](docs/requirements.md)
- [Database design](docs/database-design.md)
- [API design](docs/api-design.md)
- [Frontend design](docs/frontend-design.md)
- [Testing strategy](docs/testing-strategy.md)
- [Phase 13 E2E verification report](docs/testing/phase-13-e2e-verification.md)
- [Project playbook](project-playbook.md), if present in the repository
- [Git workflow conventions](git-workflow-conventions.md), if present in the repository

## MVP Scope and Limitations

The MVP covers student authentication, librarian-controlled account provisioning, catalogue management, physical-copy tracking, issue and return workflows, overdue status, borrowing history, and a basic librarian summary.

Fines and payments, reservations, notifications, barcode/RFID integration, multiple library branches, recommendations, advanced analytics, and a microservices or worker architecture are outside the current MVP scope. Production deployment is not documented as completed.

## Git Workflow

Development follows the repository's Git workflow conventions:

- Do not work directly on `main` for phase implementation.
- Create a dedicated feature branch from an updated `main`.
- Use Conventional Commit messages.
- Review changes and whitespace errors before staging and committing.
- Push feature branches and use pull requests.
- Merge pull requests using **Create a merge commit**, not squash or rebase.
- Complete post-merge synchronization and branch cleanup before marking a phase complete.

## Security Notes

- Keep secrets and credentials in local environment files; never commit them.
- Use a strong JWT secret and a strong initial librarian password.
- Do not use production credentials or production databases for local tests or demo data.
- Keep backend authorization enabled even when the frontend hides routes or actions.

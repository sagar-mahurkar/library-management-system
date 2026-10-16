# Frontend Design — Library Management System

## 1. Purpose and scope

The frontend is a React single-page application for students and librarians. It consumes the REST API documented in [`api-design.md`](api-design.md). The frontend supports the approved MVP workflows and does not replace backend authentication, authorization, or ownership enforcement.

## 2. Technology

- React and TypeScript
- Vite
- React Router
- Axios
- TanStack Query
- React Hook Form and Zod
- Bootstrap and Bootstrap Icons

Use the versions pinned by `frontend/package-lock.json` for reproducible installs.

## 3. Application structure

```text
frontend/src/
├── components/   # Shared tables, forms, status, loading and error UI
├── config/       # Environment configuration
├── context/      # Authentication context and hooks
├── data/         # Mock/demo data (not the source of persisted application data)
├── layouts/      # Shared, authentication, librarian and student layouts
├── pages/        # Route-level screens
├── router/       # Route and role-based navigation configuration
├── schemas/      # Zod form/request schemas
├── services/     # API client and feature-specific API functions
└── types/        # API, authentication, book and borrowing types
```

This is a responsibility-based organization. Keep API calls in services, reusable presentation in components, and page-level workflow composition in pages. Avoid duplicating API transport logic across pages.

## 4. Routes and roles

The router provides public authentication/catalogue routes and protected student/librarian areas. Student pages include the dashboard and personal borrowing history. Librarian pages cover dashboard/summary, books, authors, physical copies, students, and borrowing management.

Frontend route guards improve navigation and user experience only. The backend remains authoritative for role checks and student-record ownership; direct API calls must receive the same protections.

## 5. API and state handling

- `VITE_API_URL` defines the API base URL; `VITE_API_TIMEOUT` configures the Axios timeout.
- The shared API client centralizes HTTP configuration and authentication headers.
- Feature services encapsulate endpoint calls and response types.
- TanStack Query is used for server data fetching and cache lifecycle where adopted.
- Authentication context exposes the signed-in user/session state to route and layout components.
- Loading, empty, and error states should be explicit for asynchronous screens.

Do not store credentials in source code. Treat browser storage as client-side session state, not as an authorization boundary.

## 6. Forms and validation

Use React Hook Form for form state and Zod schemas for input validation. Client-side validation improves feedback but must not be relied upon for data integrity; the API validates requests independently.

## 7. UI conventions

- Use Bootstrap layout and components consistently.
- Reuse shared components for page headers, pagination, tables, status badges, confirmation prompts, and loading/empty/error states.
- Keep confirmation for destructive actions and display actionable API errors without exposing stack traces or internal details.
- Keep responsive navigation and student/librarian navigation distinct by role.

## 8. Local development and checks

From `frontend/`:

```bash
npm ci
cp .env.example .env
npm run dev
npm run lint
npm run typecheck
npm run build
```

Configure `VITE_API_URL` to the backend API origin/path. Vite variables prefixed with `VITE_` are exposed to browser code and must never contain secrets.

## 9. Out of scope

The frontend does not implement reservations, fines/payments, notifications, barcode/RFID workflows, multi-branch support, recommendations, or advanced analytics as part of this MVP.

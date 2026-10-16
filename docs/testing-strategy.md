# Testing Strategy — Library Management System

## 1. Purpose

Verify the API, data-integrity rules, authentication/authorization boundaries, frontend quality, and critical end-to-end user workflows. Keep automated checks repeatable and run the relevant checks after changes.

## 2. Backend checks

Backend tooling includes Jest, Supertest, and TypeScript. Available commands from `backend/`:

```bash
npm run typecheck
npm test -- --runInBand
npm run build
npm run test:integration
```

`npm run test:integration` sets `RUN_DB_INTEGRATION_TESTS=true` and runs `tests/borrowing-integrity.integration.test.ts`; it requires an isolated test database. Configure `DATABASE_TEST_NAME` and do not run destructive integration tests against valuable data.

### Key test areas

- Registration and login validation, password hashing, and response payload safety.
- JWT authentication and invalid/missing-token behavior.
- Role authorization and prevention of student access to librarian operations.
- Student ownership boundaries for borrowing records.
- Request validation and consistent error responses.
- Book, author, student, and physical-copy rules.
- Issue/return behavior, unavailable-copy rejection, repeated-return handling, and data integrity.
- Summary endpoint access and aggregate values.

## 3. Frontend checks

From `frontend/`:

```bash
npm run lint
npm run typecheck
npm run build
```

These check lint rules, TypeScript correctness, and production bundling. They do not replace browser-level verification.

## 4. Browser end-to-end checklist

The Phase 13 report records a 21-item browser checklist spanning:

- Registration, login, logout, session refresh, invalid credentials, and role boundaries.
- Student catalogue browsing, book details, dashboard counts, borrowing history, filters, and ownership isolation.
- Librarian book/author/copy management, student/history views, issue/return behavior, unavailable-copy rejection, filters, and summary.
- Persistence after refresh, API errors, browser console/network inspection, and database relationships.

Refer to [`testing/phase-13-e2e-verification.md`](testing/phase-13-e2e-verification.md) for the detailed recorded checklist. Re-run relevant browser flows after changing their related behavior.

## 5. Phase 13 recorded results

The report records results supplied for Phase 13:

- Backend typecheck passed.
- Backend Jest run: 16 suites passed, 72 tests passed, and 2 tests skipped (74 total).
- Backend build passed.
- Frontend lint, typecheck, and build passed.
- Browser checklist reported 21/21 completed.

The report notes that an error-handler test deliberately exercises a server error; its console log is expected for that test. Skipped tests are not counted as executed passes. These are historical reported results, not claims that the commands were rerun as part of this documentation update.

## 6. Suggested verification order

1. Install from lockfiles with `npm ci` in both packages.
2. Run backend typecheck, unit tests, build, and the isolated integration suite where database access is available.
3. Run frontend lint, typecheck, and build.
4. Run browser workflows affected by the change, including authorization and borrowing integrity where applicable.
5. Inspect console/network errors and verify no credentials or sensitive server details are returned to clients.
6. Review the final Git diff and ensure no `.env`, generated output, or unrelated changes are staged.

## 7. Test data and safety

Use a dedicated local/test database and non-production accounts. Demo seeding is explicit and should never be run against production. Keep test credentials and database secrets out of version control. Avoid destructive tests against a database containing data that must be preserved.

# Library Management System — Requirements

## 1. Project Classification

- **Classification:** Small MVP
- **Original target implementation time:** 6 hours maximum (an aggressive target, not a guarantee)
- **Stack:** Node.js, Express, TypeScript, React, PostgreSQL
- **Primary goal:** Deliver a working library application for managing books, students, and borrowing operations.

The implementation prioritizes the complete core workflow over optional features and visual polish.

## 2. Problem Statement

Libraries need a simple application to maintain book records, manage student memberships, track book availability, and record book issues and returns. The system provides a centralized interface for librarians and students to perform their respective operations.

## 3. Users and Roles

### 3.1 Librarian

- Log in securely using a provisioned account.
- Manage books, authors, and physical copies.
- View student records and borrowing history.
- Issue available copies and record returns.
- View the library summary.

### 3.2 Student

- Register and log in.
- Browse the book catalogue and view availability.
- View current borrowings and personal borrowing history.
- Access only their own borrowing records.

Students must not access librarian-only operations or another student's records.

## 4. Functional Requirements

### FR-01: Student Registration

- A student can register with a name, email, and password.
- Email addresses are unique without case sensitivity.
- Passwords are hashed before storage.
- Public registration assigns the student role only and cannot grant librarian privileges.

### FR-02: Authentication and Authorization

- Students and librarians can log in using email and password.
- Successful login returns a JWT access token.
- Protected endpoints require valid authentication.
- Backend authorization enforces role access and student record ownership.
- Librarian accounts are provisioned through a controlled process, not public registration.

### FR-03: Book and Author Management

- Librarians can create, view, update, and delete book records when deletion is safe.
- Book records support title, optional ISBN, optional publisher, optional publication year, and author associations.
- Students can browse/search the catalogue and view book details and copy counts.
- Authors can be managed and associated with books.

### FR-04: Student Management

- Librarians can list students and view individual student records.
- Librarians can view a student's borrowing history.
- Password hashes are not included in student API responses.

### FR-05: Physical-Copy Availability

- Physical copies are tracked separately from book titles.
- Each copy has a unique copy code.
- A copy is available when it has no active borrowing.
- Issuing a copy makes it unavailable; a successful return makes it available again.

### FR-06: Issue Books

- A librarian can issue an available copy to a registered student.
- An issue records the student, copy, issue time, and due time.
- An unavailable copy cannot be issued again.
- Issue operations maintain consistent data using transactions and database integrity constraints.

### FR-07: Return Books

- A librarian can record the return of an active borrowing.
- The return time is recorded.
- A completed return cannot be processed again as an active issue.

### FR-08: Borrowing History and Overdue Status

- Students can view their own borrowing history.
- Librarians can view borrowing records and a student's history.
- A borrowing is overdue when it is unreturned and its due timestamp has passed.
- Overdue status is derived from due time and return status.

### FR-09: Librarian Summary

The implemented `GET /api/v1/summary` endpoint returns:

- `totalBooks`: total book titles.
- `totalCopies`: total physical copies.
- `availableCopies`: copies with no active borrowing.
- `activeBorrowings`: borrowings not yet returned.
- `overdueBorrowings`: active borrowings whose due timestamp has passed.

The API does **not** currently expose separate `total registered students` or `currently issued copies` metrics. Currently issued copies are represented by active borrowings; do not document those extra fields as implemented summary response properties unless the API is changed.

## 5. Non-Functional Requirements

- Validate request data on the backend.
- Hash passwords using an established password-hashing library.
- Store JWT secrets and database credentials in environment variables.
- Enforce authentication, role authorization, and student data ownership on the backend.
- Use database constraints to maintain data integrity.
- Prevent duplicate active issues and inconsistent copy availability.
- Use transactions for related issue/return changes.
- Use consistent HTTP status codes and error responses.
- Provide automated API tests using Jest and Supertest.
- Do not commit `.env` files or real secrets.
- Keep the implementation within the approved MVP scope.

## 6. Technology Stack

### Backend

- Node.js, Express, TypeScript
- TypeORM and PostgreSQL
- Zod request validation
- JWT authentication using `jsonwebtoken`
- bcrypt password hashing
- Jest and Supertest

### Frontend

- React, TypeScript, Vite
- React Router, Axios, TanStack Query
- React Hook Form and Zod
- Bootstrap and Bootstrap Icons

## 7. MVP Scope

**Included:**

- Student registration and login.
- Librarian login and controlled account provisioning.
- JWT authentication and role-based authorization.
- Book, author, and physical-copy management.
- Student record views.
- Book issue and return workflows.
- Due dates, overdue status, and borrowing history.
- Librarian summary API and dashboard.
- Automated API tests and frontend/backend integration.
- Setup and usage documentation.

## 8. Out of Scope

- Fines and online payments.
- Reservations and hold queues.
- Email, SMS, and push notifications.
- Barcode scanning and RFID integration.
- Multiple library branches.
- Book recommendations.
- Advanced analytics and reporting beyond the basic summary.
- Redis, background workers, and microservices.
- Elaborate UI animations.
- Production deployment unless separately approved.

## 9. Acceptance Criteria and Verification Status

The following status reflects the Phase 13 verification report and user-reported results. It should be revisited if later changes affect these behaviors.

- [x] A student can register and log in.
- [x] A librarian can log in using a provisioned account.
- [x] Passwords are hashed before persistence.
- [x] Protected endpoints reject missing or invalid authentication.
- [x] Students cannot access librarian-only operations.
- [x] Students cannot access another student's borrowing records.
- [x] Librarians can manage books and student records.
- [x] Students can browse books and check availability.
- [x] A librarian can issue an available copy to a student.
- [x] An already-issued copy cannot be issued again.
- [x] A librarian can return an issued copy.
- [x] Returned copies become available again.
- [x] Due dates, overdue status, and borrowing history are covered by the reported browser checks.
- [x] Summary counts are covered by the reported browser checks.
- [x] Backend automated test, typecheck, and build results are recorded in the Phase 13 report.
- [x] Frontend lint, typecheck, and build results are recorded in the Phase 13 report.
- [x] Frontend and backend integration critical flows were reported checked.
- [x] README and environment examples document local setup without real credentials.

The backend test report records 16 passing suites, 72 passing tests, and 2 skipped tests. Skipped tests are not counted as passing. See [`testing/phase-13-e2e-verification.md`](testing/phase-13-e2e-verification.md).

## 10. Core User Workflows

### Student

Register → Log in → Browse catalogue → Check availability → View current borrowings and history.

### Librarian

Log in → Manage books/authors/copies and view students → Issue a copy → Record return → Verify availability and borrowing history.

## 11. Delivery Rule

Prioritize authentication, authorization, data integrity, and the core issue/return workflow. Defer optional features rather than expanding the MVP during implementation.

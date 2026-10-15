# Library Management System — Requirements

## 1. Project Classification

- **Classification:** Small MVP
- **Target implementation time:** 6 hours maximum
- **Stack:** Node.js, Express, TypeScript, React, PostgreSQL
- **Primary goal:** Deliver a working library application for managing books, students, and borrowing operations.

The six-hour limit is a target, not a guarantee. Prioritize a complete core workflow over optional features and visual polish.

## 2. Problem Statement

Libraries need a simple application to maintain book records, manage student memberships, track book availability, and record book issues and returns.

The system will provide a centralized interface for librarians and students to perform their respective operations.

## 3. Users and Roles

### 3.1 Admin/Librarian

The admin/librarian manages library operations.

- Log in securely.
- Manage books and authors.
- View and manage student records.
- Issue books to students.
- Record book returns.
- View borrowing records and book availability.

### 3.2 Student/Member

Students are registered library members who can access their own accounts.

- Register and log in.
- Browse the available book catalogue.
- Check book availability.
- View their current borrowed books.
- View their borrowing history.

Students must not access librarian-only operations or another student's records.

## 4. Functional Requirements

### FR-01: Student Registration

- A student can register with a name, email, and password.
- Email addresses must be unique.
- Passwords must be hashed before storage.
- Public registration must assign the student role only.
- Public registration must not grant librarian/admin privileges.

### FR-02: Authentication and Authorization

- Students and librarians can log in using email and password.
- Successful login returns a JWT access token.
- Protected endpoints require valid authentication.
- Backend authorization enforces role-based access.
- Students can access only their own borrowing records.
- Librarian accounts must be provisioned through a controlled process, not public registration.

### FR-03: Book and Author Management

- Librarians can create, view, update, and delete book records when deletion is safe.
- Book records include a title, ISBN, author, and relevant publication details.
- Authors can be associated with books.
- Students can browse the catalogue and view book details.
- Students can check available physical copies.

### FR-04: Student Management

- Librarians can view student records.
- Librarians can view an individual student's details and borrowing records.
- Student information is protected from unauthorized access.

### FR-05: Physical-Copy Availability

- The system tracks physical copies separately from book titles.
- Each copy has a unique identifier.
- A copy can be available or issued.
- Issuing a copy makes it unavailable for another issue.
- Returning a copy makes it available again.

### FR-06: Issue Books

- A librarian can issue an available copy to a registered student.
- Each issue records the student, physical copy, issue date, and due date.
- An unavailable copy cannot be issued again.
- Issuing a book must update its availability consistently.

### FR-07: Return Books

- A librarian can record the return of an issued copy.
- The return date is recorded.
- The copy becomes available after a successful return.
- A completed return cannot be processed again as an active issue.

### FR-08: Borrowing History and Overdue Status

- Students can view their own current loans and borrowing history.
- Librarians can view borrowing records across students.
- A loan is overdue when it has not been returned and its due date has passed.
- Overdue status is derived from the due date and return status.

### FR-09: Summary Information

Provide a basic librarian summary containing:

- Total book titles.
- Total physical copies.
- Available copies.
- Currently issued copies.
- Total registered students.
- Overdue loans.

Summary values must reflect persisted database records.

## 5. Non-Functional Requirements

- Validate request data on the backend.
- Hash passwords using an established password-hashing library.
- Store JWT secrets and database credentials in environment variables.
- Enforce authentication, role authorization, and student data ownership on the backend.
- Use database constraints to maintain data integrity.
- Prevent duplicate issues and inconsistent copy availability.
- Use transactions where issuing or returning a book requires multiple related database changes.
- Use consistent HTTP status codes and error responses.
- Provide essential automated API tests using Jest and Supertest.
- Do not commit `.env` files or real secrets.
- Keep the implementation within the MVP time box.

## 6. Technology Stack

### Backend

- Node.js
- Express
- TypeScript
- TypeORM
- PostgreSQL
- Zod for request validation
- JWT authentication using `jsonwebtoken`
- `bcrypt` for password hashing
- Jest and Supertest for API testing

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- TanStack Query
- React Hook Form
- Zod
- Bootstrap and Bootstrap Icons

Use the supplied Task Management System as the reference for project setup and reusable implementation patterns. Include dependencies only where they serve the approved requirements.

## 7. MVP Scope

**Included:**

- Student registration and login.
- Librarian login and controlled account provisioning.
- JWT authentication and role-based authorization.
- Book and author management.
- Student record management.
- Physical-copy availability tracking.
- Book issue and return workflows.
- Due dates and overdue status.
- Student borrowing history.
- Basic librarian summary.
- Essential automated API tests.
- Frontend/backend integration.
- Setup and usage documentation.

## 8. Out of Scope

- Fines and online payments.
- Reservations and hold queues.
- Email, SMS, and push notifications.
- Barcode scanning and RFID integration.
- Multiple library branches.
- Book recommendations.
- Advanced analytics and reporting.
- Redis, background workers, and microservices.
- Elaborate UI animations.
- Production deployment, unless core requirements are completed early.

## 9. Acceptance Criteria

- [ ] A student can register and log in.
- [ ] A librarian can log in using a provisioned account.
- [ ] Passwords are never stored in plaintext.
- [ ] Protected endpoints reject missing or invalid authentication.
- [ ] Students cannot access librarian-only operations.
- [ ] Students cannot access another student's borrowing records.
- [ ] Librarians can manage books and student records.
- [ ] Students can browse books and check availability.
- [ ] A librarian can issue an available copy to a student.
- [ ] An already-issued copy cannot be issued again.
- [ ] A librarian can return an issued copy.
- [ ] Returned copies become available again.
- [ ] Due dates, overdue status, and borrowing history are correct.
- [ ] Summary counts reflect persisted database data.
- [ ] Relevant automated API tests pass.
- [ ] Frontend and backend run together successfully.
- [ ] README and `.env.example` document local setup without real secrets.

## 10. Core User Workflows

### Student

Register → Log in → Browse catalogue → Check availability → View current loans and borrowing history.

### Librarian

Log in → Manage books and students → Issue a copy → Record return → Verify availability and borrowing records.

## 11. Delivery Rule

Implement and verify the core library workflow first. Prioritize correct physical-copy availability and reliable issue/return operations. Defer optional features rather than expanding the MVP during implementation.

The six-hour limit is an aggressive target. If necessary, reduce optional UI polish and summary depth while preserving authentication, authorization, data integrity, and the core issue/return workflow.

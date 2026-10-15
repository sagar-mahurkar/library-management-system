# API Design — Library Management System

## 1. Overview

The Library Management System exposes a REST API built with Node.js, Express, TypeScript, TypeORM, and PostgreSQL.

### API Conventions

- Base path: `/api/v1`
- Content type: `application/json`
- Authentication: JSON Web Token (JWT)
- Request validation: Zod
- Password hashing: bcrypt
- API testing: Jest and Supertest

### Standard Success Response

```json
{
  "data": {
    "id": "uuid",
    "name": "Example"
  }
}
```

### Standard Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data"
  }
}
```

---

## 2. Authentication and Authorization

### Authentication

Protected endpoints require the following header:

```http
Authorization: Bearer <access-token>
```

The backend verifies the JWT and derives the authenticated user's identity and role from its trusted claims.

### Roles

| Role | Permissions |
| --- | --- |
| `STUDENT` | Browse books, view availability, and access their own borrowing records |
| `LIBRARIAN` | Manage books and authors, manage student records, issue and return copies, and access summary data |

Authorization must be enforced by the backend. Frontend route restrictions are not a substitute for backend authorization.

### Registration Rules

- Public registration creates student accounts only.
- Clients cannot assign themselves the `LIBRARIAN` role.
- Librarian accounts must be provisioned through a controlled mechanism.
- Passwords must be hashed before persistence and must never appear in API responses.

---

## 3. Health API

### `GET /health`

Checks whether the application is running.

**Authentication:** Not required.

**Success — `200 OK`**

```json
{
  "data": {
    "status": "ok"
  }
}
```

---

## 4. Authentication APIs

### 4.1 Register Student

`POST /api/v1/auth/register`

Creates a student account.

**Authentication:** Not required.

Request body

```json
{
  "name": "Example Student",
  "email": "student@example.com",
  "password": "StrongPassword123"
}
```

Validation rules

- `name`: required, non-empty string, maximum 100 characters.
- `email`: required, valid email address, maximum 255 characters.
- `password`: required string; minimum and maximum lengths must be defined in the authentication validation schema.
- The request must reject unknown fields.
- Email uniqueness is case-insensitive.

**Success — `201 Created`**

```json
{
  "data": {
    "id": "uuid",
    "name": "Example Student",
    "email": "student@example.com",
    "role": "STUDENT",
    "created_at": "2026-10-15T10:00:00.000Z"
  }
}
```

Possible errors

| Status | Code | Meaning |
| --- | --- | --- |
| `400` | `VALIDATION_ERROR` | Invalid request body |
| `409` | `EMAIL_ALREADY_EXISTS` | Email is already registered |

The response must not contain the password or password hash.

### 4.2 Login

`POST /api/v1/auth/login`

Authenticates an existing student or librarian.

**Authentication:** Not required.

Request body

```json
{
  "email": "student@example.com",
  "password": "StrongPassword123"
}
```

**Success — `200 OK`**

```json
{
  "data": {
    "access_token": "<jwt>",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": "uuid",
      "name": "Example Student",
      "email": "student@example.com",
      "role": "STUDENT"
    }
  }
}
```

`expires_in` is expressed in seconds and must reflect the configured token lifetime.

Possible errors

| Status | Code | Meaning |
| --- | --- | --- |
| `400` | `VALIDATION_ERROR` | Invalid request body |
| `401` | `INVALID_CREDENTIALS` | Email or password is incorrect |

Use a consistent error response for unknown email addresses and incorrect passwords.

---

## 5. Authentication Middleware

### Authentication Responsibilities

The authentication middleware must:

1. Read the `Authorization` header.
2. Require the `Bearer` scheme and a token.
3. Verify the JWT signature and expiration.
4. Validate required token claims.
5. Establish the authenticated user identity and role in the request context.
6. Reject invalid, expired, or malformed tokens.

Expected errors

| Status | Code | Meaning |
| --- | --- | --- |
| `401` | `AUTHENTICATION_REQUIRED` | Token is missing |
| `401` | `INVALID_TOKEN` | Token is invalid, malformed, or expired |

The exact error codes should remain consistent across protected endpoints.

---

## 6. Role Authorization Middleware

### Authorization Responsibilities

The role authorization middleware restricts access to endpoints based on the authenticated user's role.

Example access rules

| Operation | Student | Librarian |
| --- | --- | --- |
| Register student | Public | Public |
| Login | Public | Public |
| Browse catalogue | Allowed | Allowed |
| Manage books and authors | Denied | Allowed |
| Manage student records | Denied | Allowed |
| Issue or return a copy | Denied | Allowed |
| View librarian summary | Denied | Allowed |
| View own borrowing history | Allowed | Allowed |

**Forbidden response — `403 Forbidden`**

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action"
  }
}
```

Authentication identifies the user; authorization determines whether the user may perform the operation.

---

## 7. Planned Feature APIs

The following endpoints describe the planned API surface for later phases. They are contracts for future implementation, not a claim that these endpoints already exist.

### 7.1 Books and Authors

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/v1/books` | Public | Browse books |
| `GET` | `/api/v1/books/:id` | Public | View book details |
| `POST` | `/api/v1/books` | Librarian | Create a book and associate authors |
| `PATCH` | `/api/v1/books/:id` | Librarian | Update book details |
| `DELETE` | `/api/v1/books/:id` | Librarian | Delete a book when permitted by data-integrity rules |
| `GET` | `/api/v1/authors` | Public | Browse authors |
| `POST` | `/api/v1/authors` | Librarian | Create an author |
| `PATCH` | `/api/v1/authors/:id` | Librarian | Update an author |
| `DELETE` | `/api/v1/authors/:id` | Librarian | Delete an author when permitted by foreign-key rules |

### 7.2 Physical Book Copies

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/v1/books/:id/copies` | Public | View copies and availability |
| `POST` | `/api/v1/books/:id/copies` | Librarian | Add a physical copy |
| `DELETE` | `/api/v1/copies/:id` | Librarian | Remove a copy when permitted by borrowing-history constraints |

### 7.3 Student Records

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/v1/students` | Librarian | List student records |
| `GET` | `/api/v1/students/:id` | Librarian | View a student record |

Student account creation is covered by public registration. Additional account-management operations should be defined only when required by the approved scope.

### 7.4 Borrowings

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/v1/borrowings` | Librarian | Issue an available physical copy to a student |
| `PATCH` | `/api/v1/borrowings/:id/return` | Librarian | Record a return |
| `GET` | `/api/v1/borrowings/me` | Student | View own borrowing records |
| `GET` | `/api/v1/students/:id/borrowings` | Librarian | View a student's borrowing records |

The backend must prevent a physical copy from being issued to multiple users simultaneously. Issuing and returning must preserve database integrity and borrowing history.

### 7.5 Summary

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/v1/summary` | Librarian | Retrieve basic library summary statistics |

Summary values must be derived from persisted database records.

---

## 8. Standard HTTP Status Codes

| Status | Usage |
| --- | --- |
| `200 OK` | Successful retrieval, login, or update |
| `201 Created` | Resource successfully created |
| `204 No Content` | Successful operation with no response body, where appropriate |
| `400 Bad Request` | Request validation failure |
| `401 Unauthorized` | Missing or invalid authentication |
| `403 Forbidden` | Authenticated user lacks permission |
| `404 Not Found` | Requested resource does not exist |
| `409 Conflict` | Duplicate or conflicting resource state |
| `500 Internal Server Error` | Unexpected server failure |

---

## 9. Validation and Error Handling

- Validate request bodies, path parameters, and query parameters on the backend.
- Use Zod schemas for request validation.
- Reject unexpected request-body fields where appropriate.
- Keep error responses consistent.
- Never expose stack traces, password hashes, JWT secrets, or database credentials in API responses.
- Handle unexpected errors through centralized error-handling middleware.
- Use database constraints to enforce data integrity rather than relying exclusively on application validation.

---

## 10. Testing Requirements

Authentication and API foundation tests should cover:

- Successful student registration.
- Invalid registration payloads.
- Duplicate email registration, including case variations.
- Password hashing and exclusion of password hashes from responses.
- Successful login for provisioned users.
- Invalid login credentials.
- Missing, malformed, invalid, and expired JWTs.
- Protected endpoints without authentication.
- Student access to librarian-only endpoints.
- Librarian access to authorized endpoints.
- Consistent error response formats.
- Existing health endpoint behavior.

Use Jest and Supertest for automated API tests.

---

## 11. Security and Configuration

- Store `JWT_SECRET_KEY` in environment configuration, never in source code.
- Use the configured JWT expiration.
- Hash passwords with bcrypt.
- Never trust a client-supplied role or user ID to establish identity or permissions.
- Derive identity and role from verified authentication context.
- Keep `.env` files out of Git and maintain safe placeholders in `.env.example`.

---

## 12. Implementation Boundaries

Phase 6 implements the shared API foundation and authentication.

Book and author management, physical-copy management, student record APIs, borrowing workflows, and summary APIs are planned for subsequent feature phases.

The API contract must be updated when implementation decisions change. Documentation, validation schemas, automated tests, and endpoint behavior must remain consistent.

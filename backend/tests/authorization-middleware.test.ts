jest.mock("../src/config/env", () => ({
  env: {
    JWT_SECRET_KEY: "test-secret-key-that-is-at-least-32-characters-long",
    JWT_EXPIRES_IN: "1h",
  },
}));

import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { authenticate } from "../src/middleware/authenticate";
import { authorizeRole } from "../src/middleware/authorize-role";

const secret = "test-secret-key-that-is-at-least-32-characters-long";
function token(role: "STUDENT" | "LIBRARIAN") {
  return jwt.sign(
    { role }, secret,
    { subject: "a1b2c3d4-e5f6-4789-8123-123456789abc", expiresIn: "1h", issuer: "library-management-system", audience: "library-management-api" },
  );
}

function createApp() {
  const app = express();
  app.get("/librarian", authenticate, authorizeRole("LIBRARIAN"), (_request, response) => {
    response.json({ data: { allowed: true } });
  });
  app.get("/either", authenticate, authorizeRole("STUDENT", "LIBRARIAN"), (_request, response) => {
    response.json({ data: { allowed: true } });
  });
  return app;
}

describe("authorizeRole middleware", () => {
  const app = createApp();

  it("returns 401 if role authorization is called without authentication", async () => {
    const isolatedApp = express();
    isolatedApp.get("/role-only", authorizeRole("LIBRARIAN"), (_request, response) => response.sendStatus(200));
    const response = await request(isolatedApp).get("/role-only");
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("AUTHENTICATION_REQUIRED");
  });

  it("denies a student access to a librarian-only operation", async () => {
    const response = await request(app).get("/librarian").set("Authorization", `Bearer ${token("STUDENT")}`);
    expect(response.status).toBe(403);
    expect(response.body.error).toEqual({
      code: "FORBIDDEN",
      message: "You do not have permission to perform this action",
    });
  });

  it("allows a librarian to access a librarian-only operation", async () => {
    const response = await request(app).get("/librarian").set("Authorization", `Bearer ${token("LIBRARIAN")}`);
    expect(response.status).toBe(200);
    expect(response.body.data.allowed).toBe(true);
  });

  it("allows either supported role when the route permits both", async () => {
    for (const role of ["STUDENT", "LIBRARIAN"] as const) {
      const response = await request(app).get("/either").set("Authorization", `Bearer ${token(role)}`);
      expect(response.status).toBe(200);
    }
  });
});

describe("authorizeRole denial regression", () => {
  it("does not allow a student through a librarian-only route", async () => {
    const response = await request(createApp()).get("/librarian").set("Authorization", `Bearer ${token("STUDENT")}`);
    expect(response.status).toBe(403);
    expect(response.body.data).toBeUndefined();
    expect(response.body.error.code).toBe("FORBIDDEN");
  });
});

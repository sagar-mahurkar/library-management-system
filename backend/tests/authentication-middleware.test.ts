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

const secret = "test-secret-key-that-is-at-least-32-characters-long";
const validToken = () => jwt.sign(
  { role: "STUDENT" },
  secret,
  { subject: "a1b2c3d4-e5f6-4789-8123-123456789abc", expiresIn: "1h", issuer: "library-management-system", audience: "library-management-api" },
);

function createApp() {
  const app = express();
  app.get("/protected", authenticate, (request, response) => {
    response.json({ data: { userId: request.auth?.userId, role: request.auth?.role } });
  });
  return app;
}

describe("authenticate middleware", () => {
  const app = createApp();

  it("rejects a missing authorization header", async () => {
    const response = await request(app).get("/protected");
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("AUTHENTICATION_REQUIRED");
  });

  it.each(["Basic abc", "Bearer", "Bearer one two", "Bearer malformed.token.value"])(
    "rejects malformed authorization header: %s",
    async (authorization) => {
      const response = await request(app).get("/protected").set("Authorization", authorization);
      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe("INVALID_TOKEN");
    },
  );

  it("rejects an expired token", async () => {
    const expiredToken = jwt.sign(
      { role: "STUDENT" },
      secret,
      { subject: "a1b2c3d4-e5f6-4789-8123-123456789abc", expiresIn: -1, issuer: "library-management-system", audience: "library-management-api" },
    );
    const response = await request(app).get("/protected").set("Authorization", `Bearer ${expiredToken}`);
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_TOKEN");
  });

  it("rejects a token without required role claims", async () => {
    const token = jwt.sign(
      {},
      secret,
      { subject: "a1b2c3d4-e5f6-4789-8123-123456789abc", expiresIn: "1h", issuer: "library-management-system", audience: "library-management-api" },
    );
    const response = await request(app).get("/protected").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_TOKEN");
  });

  it("establishes the user identity and role for a valid token", async () => {
    const response = await request(app).get("/protected").set("Authorization", `Bearer ${validToken()}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({ userId: "a1b2c3d4-e5f6-4789-8123-123456789abc", role: "STUDENT" });
  });
});

describe("authenticate middleware token integrity", () => {
  it("rejects a correctly formed token signed with a different secret", async () => {
    const token = jwt.sign(
      { role: "STUDENT" },
      "a-different-secret-that-is-also-long-enough-for-testing",
      { subject: "a1b2c3d4-e5f6-4789-8123-123456789abc", expiresIn: "1h", issuer: "library-management-system", audience: "library-management-api" },
    );
    const response = await request(createApp()).get("/protected").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_TOKEN");
  });
});

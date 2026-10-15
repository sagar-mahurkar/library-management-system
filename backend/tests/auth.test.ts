import express from "express";
import request from "supertest";
import { authRouter } from "../src/modules/auth/auth.routes";
import { AuthServiceError, authService } from "../src/modules/auth/auth.service";

const authResponse = {
  user: {
    id: "a1b2c3d4-e5f6-4789-8123-123456789abc",
    name: "Test Student",
    email: "student@example.com",
    role: "STUDENT",
  },
  access_token: "signed-token",
  token_type: "Bearer",
  expires_in: 3600,
} as const;

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/v1/auth", authRouter);
  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    response.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" } });
  });
  return app;
}

describe("authentication API", () => {
  const app = createApp();
  afterEach(() => jest.restoreAllMocks());

  it("registers a student and returns 201 without a password hash", async () => {
    jest.spyOn(authService, "register").mockResolvedValue(authResponse);

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Test Student", email: "student@example.com", password: "password123" });

    expect(response.status).toBe(201);
    expect(response.body.data.user.role).toBe("STUDENT");
    expect(response.body.data.user.passwordHash).toBeUndefined();
    expect(response.body.data.access_token).toBe("signed-token");
  });

  it("rejects invalid registration input", async () => {
    const registerSpy = jest.spyOn(authService, "register");
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "", email: "not-an-email", password: "short" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(registerSpy).not.toHaveBeenCalled();
  });

  it("rejects extra registration fields so a client cannot request a role", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Test Student", email: "student@example.com", password: "password123", role: "LIBRARIAN" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns a consistent conflict when the email is already registered", async () => {
    jest.spyOn(authService, "register").mockRejectedValue(
      new AuthServiceError(409, "EMAIL_ALREADY_EXISTS", "An account with this email already exists"),
    );

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Test Student", email: "student@example.com", password: "password123" });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("EMAIL_ALREADY_EXISTS");
  });

  it("logs in and returns a bearer access token", async () => {
    jest.spyOn(authService, "login").mockResolvedValue(authResponse);

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "student@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.data.token_type).toBe("Bearer");
    expect(response.body.data.user.role).toBe("STUDENT");
  });

  it("uses the same invalid-credentials response for failed login", async () => {
    jest.spyOn(authService, "login").mockRejectedValue(
      new AuthServiceError(401, "INVALID_CREDENTIALS", "Email or password is incorrect"),
    );

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "student@example.com", password: "wrong-password" });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
  });
});

describe("authentication hardening regressions", () => {
  afterEach(() => jest.restoreAllMocks());

  it("normalizes email before passing registration data to the service", async () => {
    const registerSpy = jest.spyOn(authService, "register").mockResolvedValue(authResponse);
    const response = await request(createApp())
      .post("/api/v1/auth/register")
      .send({ name: "Test Student", email: "  STUDENT@EXAMPLE.COM  ", password: "password123" });

    expect(response.status).toBe(201);
    expect(registerSpy).toHaveBeenCalledWith({ name: "Test Student", email: "student@example.com", password: "password123" });
    expect(response.body.data.user).not.toHaveProperty("passwordHash");
    expect(response.body.data.user).not.toHaveProperty("password_hash");
  });
});

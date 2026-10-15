import express from "express";
import request from "supertest";

jest.mock("../src/utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

import { errorHandler } from "../src/middleware/error-handler";
import { logger } from "../src/utils/logger";

function createApp(error: unknown) {
  const app = express();

  app.get("/failure", (_req, _res, next) => next(error));
  app.use(errorHandler);

  return app;
}

describe("errorHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a consistent response for client errors", async () => {
    const error = Object.assign(new Error("Invalid request"), {
      status: 422,
    });

    const response = await request(createApp(error)).get("/failure");

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: {
        code: "REQUEST_ERROR",
        message: "Invalid request",
      },
    });
  });

  it("returns a generic response for unexpected errors", async () => {
    const response = await request(
      createApp(
        new Error("database connection details should not be returned"),
      ),
    ).get("/failure");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      },
    });

    expect(logger.error).toHaveBeenCalledWith(
      "Request failed",
      expect.objectContaining({
        statusCode: 500,
        message: "database connection details should not be returned",
      }),
    );
  });

  it("does not expose arbitrary thrown values", async () => {
    const response = await request(
      createApp({ sensitive: "secret" }),
    ).get("/failure");

    expect(response.status).toBe(500);
    expect(response.body.error.code).toBe("INTERNAL_SERVER_ERROR");
    expect(response.body.error.message).toBe("Internal server error");
    expect(response.text).not.toContain("secret");

    expect(logger.error).toHaveBeenCalledWith(
      "Request failed",
      expect.objectContaining({ statusCode: 500 }),
    );
  });
});

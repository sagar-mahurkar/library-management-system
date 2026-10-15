import type { ErrorRequestHandler } from "express";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  const statusCode =
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number" &&
    error.status >= 400 &&
    error.status < 600
      ? error.status
      : 500;

  logger.error("Request failed", {
    statusCode,
    message: error instanceof Error ? error.message : "Unknown error",
  });

  const isServerError = statusCode >= 500;

  res.status(statusCode).json({
    error: {
      code: isServerError ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR",
      message:
        isServerError
          ? "Internal server error"
          : error instanceof Error
            ? error.message
            : "Request failed",
    },
  });
};

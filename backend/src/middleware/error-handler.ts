import type { ErrorRequestHandler } from "express";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  const statusCode =
    typeof error.status === "number" &&
    error.status >= 400 &&
    error.status < 600
      ? error.status
      : 500;

  logger.error("Request failed", {
    statusCode,
    message: error instanceof Error ? error.message : "Unknown error"
  });

  res.status(statusCode).json({
    error: {
      code: statusCode === 500 ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR",
      message:
        statusCode === 500 && env.NODE_ENV === "production"
          ? "An unexpected error occurred"
          : error instanceof Error
            ? error.message
            : "An unexpected error occurred"
    }
  });
};

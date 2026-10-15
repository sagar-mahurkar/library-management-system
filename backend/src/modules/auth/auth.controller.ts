import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AuthServiceError, authService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schemas";

function sendError(
  response: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown,
): void {
  response.status(status).json({
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details }),
    },
  });
}

function handleError(error: unknown, response: Response, next: NextFunction): void {
  if (error instanceof ZodError) {
    sendError(response, 400, "VALIDATION_ERROR", "Request validation failed", error.issues);
    return;
  }
  if (error instanceof AuthServiceError) {
    sendError(response, error.statusCode, error.code, error.message);
    return;
  }
  next(error);
}

export async function register(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = registerSchema.parse(request.body);
    const result = await authService.register(input);
    response.status(201).json({ data: result });
  } catch (error) {
    handleError(error, response, next);
  }
}

export async function login(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = loginSchema.parse(request.body);
    const result = await authService.login(input);
    response.status(200).json({ data: result });
  } catch (error) {
    handleError(error, response, next);
  }
}

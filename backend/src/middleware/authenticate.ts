import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import type { UserRole } from "../entities/user.entity";

export interface AuthenticatedIdentity {
  userId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthenticatedIdentity;
    }
  }
}

function unauthorized(
  response: Response,
  code: "AUTHENTICATION_REQUIRED" | "INVALID_TOKEN",
  message: string,
): void {
  response.status(401).json({ error: { code, message } });
}

export function authenticate(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authorization = request.get("authorization");
  if (!authorization) {
    unauthorized(response, "AUTHENTICATION_REQUIRED", "Authentication token is required");
    return;
  }

  const match = /^Bearer\s+(\S+)$/i.exec(authorization.trim());
  if (!match) {
    unauthorized(response, "INVALID_TOKEN", "Bearer token is invalid or malformed");
    return;
  }

  try {
    const claims = verifyAccessToken(match[1]);
    request.auth = { userId: claims.sub, role: claims.role };
    next();
  } catch {
    unauthorized(response, "INVALID_TOKEN", "Bearer token is invalid or expired");
  }
}

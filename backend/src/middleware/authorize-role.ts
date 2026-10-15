import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../entities/user.entity";

export function authorizeRole(...allowedRoles: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    // Authentication middleware should run first; missing identity is not authorization denial.
    if (!request.auth) {
      response.status(401).json({
        error: { code: "AUTHENTICATION_REQUIRED", message: "Authentication is required" },
      });
      return;
    }

    if (!allowedRoles.includes(request.auth.role)) {
      response.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action",
        },
      });
      return;
    }

    next();
  };
}

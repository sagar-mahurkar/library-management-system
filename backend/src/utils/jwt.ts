import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import type { UserRole } from "../entities/user.entity";

export interface AccessTokenClaims extends JwtPayload {
  sub: string;
  role: UserRole;
}

const TOKEN_ISSUER = "library-management-system";

export function signAccessToken(user: {
  id: string;
  role: UserRole;
}): string {
  return jwt.sign(
    { role: user.role },
    env.JWT_SECRET_KEY,
    {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
      issuer: TOKEN_ISSUER,
      audience: "library-management-api",
    },
  );
}

/** Verify signature, expiry, issuer, audience, and application-required claims. */
export function verifyAccessToken(token: string): AccessTokenClaims {
  const decoded = jwt.verify(token, env.JWT_SECRET_KEY, {
    issuer: TOKEN_ISSUER,
    audience: "library-management-api",
  });

  if (
    typeof decoded === "string" ||
    typeof decoded.sub !== "string" ||
    decoded.sub.length === 0 ||
    (decoded.role !== "STUDENT" && decoded.role !== "LIBRARIAN")
  ) {
    throw new Error("Required JWT claims are missing or invalid");
  }

  return decoded as AccessTokenClaims;
}

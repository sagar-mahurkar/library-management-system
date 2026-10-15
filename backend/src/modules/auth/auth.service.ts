import type { User } from "../../entities/user.entity";
import { hashPassword, verifyPassword } from "../../utils/password";
import { signAccessToken } from "../../utils/jwt";
import { authRepository, type AuthRepository } from "./auth.repository";
import type { LoginInput, RegisterInput } from "./auth.schemas";

export class AuthServiceError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: User["role"];
}

export interface AuthResponse {
  user: AuthUserResponse;
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
}

function toAuthUser(user: User): AuthUserResponse {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function tokenLifetimeSeconds(token: string): number {
  // The token was just signed by this service; decoding is sufficient to report exp.
  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
  ) as { iat?: number; exp?: number };
  return typeof payload.iat === "number" && typeof payload.exp === "number"
    ? payload.exp - payload.iat
    : 0;
}

export class AuthService {
  constructor(private readonly repository: AuthRepository = authRepository) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existing = await this.repository.findByEmail(input.email);
    if (existing) {
      throw new AuthServiceError(409, "EMAIL_ALREADY_EXISTS", "An account with this email already exists");
    }

    let user: User;
    try {
      user = await this.repository.createStudent({
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash: await hashPassword(input.password),
      });
    } catch (error) {
      // The database unique index remains the final protection against concurrent registrations.
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23505"
      ) {
        throw new AuthServiceError(409, "EMAIL_ALREADY_EXISTS", "An account with this email already exists");
      }
      throw error;
    }

    return this.createAuthResponse(user);
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.repository.findByEmail(input.email);
    // Keep the response identical for unknown emails and wrong passwords.
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw new AuthServiceError(401, "INVALID_CREDENTIALS", "Email or password is incorrect");
    }

    return this.createAuthResponse(user);
  }

  private createAuthResponse(user: User): AuthResponse {
    const accessToken = signAccessToken({ id: user.id, role: user.role });
    return {
      user: toAuthUser(user),
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: tokenLifetimeSeconds(accessToken),
    };
  }
}

export const authService = new AuthService();

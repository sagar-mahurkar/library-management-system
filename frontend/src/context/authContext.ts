import { createContext } from "react";
import type { LoginInput, RegisterInput, User } from "../types/auth.types";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export const USER_STORAGE_KEY = "library_user";

import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LoginInput, RegisterInput, User } from "../types/auth.types";
import { TOKEN_STORAGE_KEY } from "../services/apiClient";
import * as authService from "../services/authService";
import { AuthContext, USER_STORAGE_KEY } from "./authContext";

function readUser(): User | null {
  try {
    const value = localStorage.getItem(USER_STORAGE_KEY);
    return value ? (JSON.parse(value) as User) : null;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readUser);

  const login = useCallback(async (input: LoginInput) => {
    const result = await authService.login(input);

    localStorage.setItem(TOKEN_STORAGE_KEY, result.access_token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user));
    setUser(result.user);

    return result.user;
  }, []);

  const register = useCallback(
    async (input: RegisterInput) => authService.register(input),
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(
        user && localStorage.getItem(TOKEN_STORAGE_KEY),
      ),
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

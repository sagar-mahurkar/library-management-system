export type UserRole = "STUDENT" | "LIBRARIAN";
export interface User { id: string; name: string; email: string; role: UserRole }
export interface LoginInput { email: string; password: string }
export interface RegisterInput { name: string; email: string; password: string }
export interface LoginResponse { access_token: string; token_type: "Bearer"; expires_in: number; user: User }

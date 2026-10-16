import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormValues } from "../../schemas/auth.schema";
import { useAuth } from "../../context/useAuth";
import { getApiErrorMessage } from "../../services/apiHelpers";
import FormField from "../FormField";
export default function LoginForm() {
 const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation(); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
 const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
 const onSubmit = async (values: LoginFormValues) => { setError(""); setBusy(true); try { const user = await login(values); const target = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname; navigate(target ?? (user.role === "LIBRARIAN" ? "/librarian" : "/student"), { replace: true }); } catch (e) { setError(getApiErrorMessage(e)); } finally { setBusy(false); } };
 return <form onSubmit={handleSubmit(onSubmit)} noValidate>{error && <div className="alert alert-danger" role="alert">{error}</div>}<FormField label="Email address" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} error={errors.email?.message} /><FormField label="Password" type="password" autoComplete="current-password" placeholder="Enter your password" {...register("password")} error={errors.password?.message} /><button className="btn btn-primary w-100 mt-2" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button><p className="text-center small text-secondary mt-3 mb-0">New student? <Link to="/register">Create an account</Link></p></form>;
}

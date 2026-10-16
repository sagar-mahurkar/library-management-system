import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema, type RegisterFormValues } from "../../schemas/auth.schema";
import { useAuth } from "../../context/useAuth";
import { getApiErrorMessage } from "../../services/apiHelpers";
import FormField from "../FormField";
export default function RegisterForm() {
 const { register: registerUser } = useAuth(); const navigate = useNavigate(); const [error, setError] = useState(""); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
 const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });
 const onSubmit = async (values: RegisterFormValues) => { setError(""); setMessage(""); setBusy(true); try { await registerUser(values); setMessage("Account created. Sign in to continue."); window.setTimeout(() => navigate("/login"), 800); } catch (e) { setError(getApiErrorMessage(e)); } finally { setBusy(false); } };
 return <form onSubmit={handleSubmit(onSubmit)} noValidate>{error && <div className="alert alert-danger" role="alert">{error}</div>}{message && <div className="alert alert-success" role="status">{message}</div>}<FormField label="Full name" autoComplete="name" placeholder="Your full name" {...register("name")} error={errors.name?.message} /><FormField label="Email address" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} error={errors.email?.message} /><FormField label="Password" type="password" autoComplete="new-password" placeholder="At least 8 characters" {...register("password")} error={errors.password?.message} /><button className="btn btn-primary w-100 mt-2" type="submit" disabled={busy}>{busy ? "Creating account…" : "Create student account"}</button><p className="text-center small text-secondary mt-3 mb-0">Already registered? <Link to="/login">Sign in</Link></p></form>;
}

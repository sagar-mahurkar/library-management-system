import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { loginSchema, type LoginFormValues } from "../../schemas/auth.schema";
import FormField from "../FormField";
export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  return <form onSubmit={handleSubmit(() => window.alert("UI preview only: authentication is implemented in Phase 12."))}>
    <FormField label="Email address" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} error={errors.email?.message} />
    <FormField label="Password" type="password" autoComplete="current-password" placeholder="Enter your password" {...register("password")} error={errors.password?.message} />
    <button className="btn btn-primary w-100 mt-2" type="submit">Sign in</button>
    <p className="text-center small text-secondary mt-3 mb-0">New student? <Link to="/register">Create an account</Link></p>
  </form>;
}

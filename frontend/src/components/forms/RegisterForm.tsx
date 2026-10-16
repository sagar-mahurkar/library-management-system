import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { registerSchema, type RegisterFormValues } from "../../schemas/auth.schema";
import FormField from "../FormField";
export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });
  return <form onSubmit={handleSubmit(() => window.alert("UI preview only: registration is connected in Phase 12."))}>
    <FormField label="Full name" autoComplete="name" placeholder="Your full name" {...register("name")} error={errors.name?.message} />
    <FormField label="Email address" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} error={errors.email?.message} />
    <FormField label="Password" type="password" autoComplete="new-password" placeholder="At least 8 characters" {...register("password")} error={errors.password?.message} />
    <button className="btn btn-primary w-100 mt-2" type="submit">Create student account</button>
    <p className="text-center small text-secondary mt-3 mb-0">Already registered? <Link to="/login">Sign in</Link></p>
  </form>;
}

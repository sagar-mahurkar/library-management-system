import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authorSchema, type AuthorFormValues } from "../../schemas/author.schema";
import FormField from "../FormField";
export default function AuthorForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<AuthorFormValues>({ resolver: zodResolver(authorSchema) });
  return <form onSubmit={handleSubmit(() => window.alert("UI preview only: author changes are connected in Phase 12."))}><FormField label="Author name" placeholder="Full name" {...register("name")} error={errors.name?.message} /><button className="btn btn-primary" type="submit">Save author</button></form>;
}

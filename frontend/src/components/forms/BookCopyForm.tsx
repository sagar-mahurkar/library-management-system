import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { bookCopySchema, type BookCopyFormValues } from "../../schemas/book-copy.schema";
import FormField from "../FormField";
export default function BookCopyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<BookCopyFormValues>({ resolver: zodResolver(bookCopySchema) });
  return <form onSubmit={handleSubmit(() => window.alert("UI preview only: copy changes are connected in Phase 12."))}><FormField label="Book ID" placeholder="Select/book ID" {...register("bookId")} error={errors.bookId?.message} /><FormField label="Copy code" placeholder="e.g. CC-005" {...register("copyCode")} error={errors.copyCode?.message} /><button className="btn btn-primary" type="submit">Add copy</button></form>;
}

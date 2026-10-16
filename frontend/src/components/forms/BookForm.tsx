import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { bookSchema } from "../../schemas/book.schema";
import FormField from "../FormField";
export default function BookForm({ onCancel }: { onCancel?: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
      z.input<typeof bookSchema>,
      unknown,
      z.output<typeof bookSchema>
    >({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      isbn: "",
      publisher: "",
      authorIds: [],
    },
  });
  return <form onSubmit={handleSubmit(() => window.alert("UI preview only: book changes are connected in Phase 12."))}>
    <FormField label="Title" placeholder="Book title" {...register("title")} error={errors.title?.message} />
    <FormField label="ISBN" placeholder="Optional ISBN" {...register("isbn")} error={errors.isbn?.message} />
    <FormField label="Publisher" placeholder="Publisher name" {...register("publisher")} error={errors.publisher?.message} />
    <FormField label="Publication year" type="number" placeholder="e.g. 2024" {...register("publicationYear")} error={errors.publicationYear?.message} />
    <div className="d-flex justify-content-end gap-2"><button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button><button className="btn btn-primary" type="submit">Save book</button></div>
  </form>;
}

import { z } from "zod";
export const bookSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(255),
  isbn: z.string().trim().max(20).optional(),
  publisher: z.string().trim().max(150).optional(),
  publicationYear: z.coerce.number().int().min(1000).max(new Date().getFullYear() + 1).optional().or(z.literal(0).transform(() => undefined)),
  authorIds: z.array(z.string()).default([]),
});
export type BookFormValues = z.infer<typeof bookSchema>;

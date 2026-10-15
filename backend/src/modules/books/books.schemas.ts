import { z } from "zod";

const nullableText = (max: number) => z.union([z.string().trim().max(max), z.null()]);
const authorIdsSchema = z.array(z.uuid()).min(1).max(50);

export const bookIdParamsSchema = z.object({ id: z.uuid() }).strict();
export const listBooksQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export const createBookSchema = z.object({
  title: z.string().trim().min(1).max(255),
  isbn: nullableText(20).optional(),
  publisher: nullableText(150).optional(),
  publicationYear: z.number().int().min(1000).max(new Date().getFullYear() + 1).nullable().optional(),
  authorIds: authorIdsSchema,
}).strict();
export const updateBookSchema = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  isbn: nullableText(20).optional(),
  publisher: nullableText(150).optional(),
  publicationYear: z.number().int().min(1000).max(new Date().getFullYear() + 1).nullable().optional(),
  authorIds: authorIdsSchema.optional(),
}).strict().refine((value) => Object.keys(value).length > 0, "At least one field must be provided");

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type ListBooksQuery = z.infer<typeof listBooksQuerySchema>;

import { z } from "zod";
export const bookCopiesParamsSchema = z.object({ bookId: z.uuid() }).strict();
export const copyIdParamsSchema = z.object({ id: z.uuid() }).strict();
export const createBookCopySchema = z.object({ copyCode: z.string().trim().min(1).max(50) }).strict();
export type CreateBookCopyInput = z.infer<typeof createBookCopySchema>;

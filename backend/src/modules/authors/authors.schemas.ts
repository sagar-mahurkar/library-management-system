import { z } from "zod";
export const authorIdParamsSchema = z.object({ id: z.uuid() }).strict();
export const listAuthorsQuerySchema = z.object({ search: z.string().trim().max(100).optional(), page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(20) });
export const createAuthorSchema = z.object({ name: z.string().trim().min(1).max(150) }).strict();
export const updateAuthorSchema = z.object({ name: z.string().trim().min(1).max(150) }).strict();
export type CreateAuthorInput = z.infer<typeof createAuthorSchema>;
export type ListAuthorsQuery = z.infer<typeof listAuthorsQuerySchema>;

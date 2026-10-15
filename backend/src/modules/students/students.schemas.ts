import { z } from "zod";
export const studentIdParamsSchema = z.object({ id: z.uuid() }).strict();
export const listStudentsQuerySchema = z.object({ search: z.string().trim().max(100).optional(), page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(20) });
export type ListStudentsQuery = z.infer<typeof listStudentsQuerySchema>;

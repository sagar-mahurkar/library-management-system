import { z } from "zod";
export const borrowingIdParamsSchema = z.object({ id: z.uuid() }).strict();
export const studentBorrowingsParamsSchema = z.object({ studentId: z.uuid() }).strict();
export const issueBorrowingSchema = z.object({ studentId: z.uuid(), bookCopyId: z.uuid(), dueAt: z.iso.datetime({ offset: true }) }).strict();
export const listBorrowingsQuerySchema = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(20), status: z.enum(["all", "active", "overdue", "returned"]).default("all") });
export type IssueBorrowingInput = z.infer<typeof issueBorrowingSchema>;
export type ListBorrowingsQuery = z.infer<typeof listBorrowingsQuerySchema>;

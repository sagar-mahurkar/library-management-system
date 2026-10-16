import { z } from "zod";
export const bookCopySchema = z.object({
  bookId: z.string().min(1, "Select a book."),
  copyCode: z.string().trim().min(1, "Copy code is required.").max(50),
});
export type BookCopyFormValues = z.infer<typeof bookCopySchema>;

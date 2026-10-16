import { z } from "zod";
export const authorSchema = z.object({
  name: z.string().trim().min(1, "Author name is required.").max(150),
});
export type AuthorFormValues = z.infer<typeof authorSchema>;

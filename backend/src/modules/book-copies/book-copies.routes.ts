import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorizeRole } from "../../middleware/authorize-role";
import { createCopy, deleteCopy, listCopies } from "./book-copies.controller";
export const bookCopiesRouter = Router();
bookCopiesRouter.get("/books/:bookId/copies", listCopies);
bookCopiesRouter.post("/books/:bookId/copies", authenticate, authorizeRole("LIBRARIAN"), createCopy);
bookCopiesRouter.delete("/copies/:id", authenticate, authorizeRole("LIBRARIAN"), deleteCopy);

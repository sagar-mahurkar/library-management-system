import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorizeRole } from "../../middleware/authorize-role";
import { getMyBorrowings, getStudentBorrowings, issueBorrowing, returnBorrowing } from "./borrowings.controller";
export const borrowingsRouter = Router();
borrowingsRouter.post("/borrowings", authenticate, authorizeRole("LIBRARIAN"), issueBorrowing);
borrowingsRouter.patch("/borrowings/:id/return", authenticate, authorizeRole("LIBRARIAN"), returnBorrowing);
borrowingsRouter.get("/borrowings/me", authenticate, getMyBorrowings);
borrowingsRouter.get("/students/:studentId/borrowings", authenticate, authorizeRole("LIBRARIAN"), getStudentBorrowings);

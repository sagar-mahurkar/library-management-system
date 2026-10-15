import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorizeRole } from "../../middleware/authorize-role";
import { getStudent, listStudents } from "./students.controller";
export const studentsRouter = Router();
studentsRouter.use(authenticate, authorizeRole("LIBRARIAN"));
studentsRouter.get("/", listStudents);
studentsRouter.get("/:id", getStudent);

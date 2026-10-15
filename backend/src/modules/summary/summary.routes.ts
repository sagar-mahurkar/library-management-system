import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorizeRole } from "../../middleware/authorize-role";
import { getSummary } from "./summary.controller";

export const summaryRouter = Router();

summaryRouter.get("/", authenticate, authorizeRole("LIBRARIAN"), getSummary);

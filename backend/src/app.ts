import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";
import { authRouter } from "./modules/auth/auth.routes";
import { authorsRouter } from "./modules/authors/authors.routes";
import { bookCopiesRouter } from "./modules/book-copies/book-copies.routes";
import { booksRouter } from "./modules/books/books.routes";
import { borrowingsRouter } from "./modules/borrowings/borrowings.routes";
import { studentsRouter } from "./modules/students/students.routes";
import { summaryRouter } from "./modules/summary/summary.routes";

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_ORIGIN, methods: ["GET", "POST", "PATCH", "PUT", "DELETE"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.status(200).json({ data: { status: "ok" } }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/books", booksRouter);
app.use("/api/v1/authors", authorsRouter);
app.use("/api/v1", bookCopiesRouter);
app.use("/api/v1/students", studentsRouter);
app.use("/api/v1", borrowingsRouter);
app.use("/api/v1/summary", summaryRouter);

app.use(notFound);
app.use(errorHandler);
export { app };

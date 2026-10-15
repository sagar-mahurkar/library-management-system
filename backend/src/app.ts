import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";
import { authRouter } from "./modules/auth/auth.routes";


const app = express();

app.use("/api/v1/auth", authRouter);

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    data: {
      status: "ok"
    }
  });
});

app.use(notFound);
app.use(errorHandler);

export { app };

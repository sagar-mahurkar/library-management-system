
import { app } from "./app";
import { env } from "./config/env";
import { AppDataSource } from "./config/data-source";
import { provisionDatabaseIfNeeded } from "./config/database-provisioner";
import { logger } from "./utils/logger";

async function startServer(): Promise<void> {
  await provisionDatabaseIfNeeded();
  await AppDataSource.initialize();

  // Apply versioned migrations; never use schema synchronization.
  await AppDataSource.runMigrations();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT}`);
  });

  const shutdown = (signal: string): void => {
    logger.info(`${signal} received; shutting down`);

    server.close(() => {
      void AppDataSource.destroy()
        .then(() => {
          process.exitCode = 0;
        })
        .catch((error: unknown) => {
          logger.error("Database shutdown failed", {
            error: error instanceof Error ? error.message : String(error),
          });
          process.exitCode = 1;
        });
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch(async (error: unknown) => {
  logger.error("Application startup failed", {
    error: error instanceof Error ? error.message : String(error),
  });

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy().catch((shutdownError: unknown) => {
      logger.error("Database cleanup after startup failure failed", {
        error:
          shutdownError instanceof Error
            ? shutdownError.message
            : String(shutdownError),
      });
    });
  }

  process.exitCode = 1;
});

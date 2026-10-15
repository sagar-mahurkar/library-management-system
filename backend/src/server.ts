import { AppDataSource } from "./config/data-source";
import { provisionDatabaseIfNeeded } from "./config/database-provisioner";
import { env } from "./config/env";
import { app } from "./app";
import { logger } from "./utils/logger";

async function startServer(): Promise<void> {
  try {
    await provisionDatabaseIfNeeded();
    await AppDataSource.initialize();

    // Phase 5 will add the initial migration. Keep schema changes migration-driven;
    // do not enable TypeORM synchronize for automatic table creation.
    if (AppDataSource.options.migrationsRun) {
      await AppDataSource.runMigrations();
    }

    const server = app.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT}`);
    });

    const shutdown = (signal: string): void => {
      logger.info(`${signal} received; shutting down`);
      server.close(() => {
        void AppDataSource.destroy().finally(() => process.exit(0));
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error(
      "Application startup failed",
      error instanceof Error ? { message: error.message, stack: error.stack } : { error: String(error) },
    );
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exitCode = 1;
  }
}

void startServer();

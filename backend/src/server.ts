import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const server = app.listen(env.PORT, () => {
  logger.info("Server started", {
    port: env.PORT,
    environment: env.NODE_ENV
  });
});

function shutdown(signal: string): void {
  logger.info("Shutdown requested", { signal });

  server.close((error) => {
    if (error) {
      logger.error("Server shutdown failed", {
        message: error.message
      });
      process.exitCode = 1;
      return;
    }

    logger.info("Server stopped");
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

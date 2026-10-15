import { Client } from "pg";
import { env } from "./env";

const DATABASE_IDENTIFIER_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;

/**
 * Creates the configured application database when it is missing.
 * Database provisioning is intentionally separate from TypeORM schema migrations.
 * Automatic creation is disabled in production.
 */
export async function provisionDatabaseIfNeeded(): Promise<void> {
  if (env.NODE_ENV === "production") {
    return;
  }

  const databaseName = env.DATABASE_NAME;
  if (!DATABASE_IDENTIFIER_PATTERN.test(databaseName)) {
    throw new Error(
      "DATABASE_NAME must start with a letter or underscore and contain only letters, digits, and underscores.",
    );
  }

  const client = new Client({
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: "postgres",
    connectionTimeoutMillis: 5_000,
  });

  let connected = false;

  try {
    await client.connect();
    connected = true;

    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [databaseName],
    );

    if (result.rowCount && result.rowCount > 0) {
      return;
    }

    // PostgreSQL does not allow a bind parameter for a database identifier.
    // The strict identifier validation above makes this interpolation safe.
    try {
      await client.query(`CREATE DATABASE "${databaseName}"`);
    } catch (error) {
      // Another app process may have created the database after our SELECT.
      if (isPostgresError(error) && error.code === "42P04") {
        return;
      }
      throw error;
    }
  } finally {
    // Only end a client whose connection was successfully established.
    if (connected) {
      await client.end();
    }
  }
}

function isPostgresError(error: unknown): error is Error & { code?: string } {
  return error instanceof Error && "code" in error;
}

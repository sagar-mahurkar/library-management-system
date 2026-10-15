/**
 * Unit tests for database provisioning. These tests mock pg and do not require
 * a running PostgreSQL server. Keep integration verification separate.
 */

const mockConnect = jest.fn();
const mockQuery = jest.fn();
const mockEnd = jest.fn();

jest.mock("pg", () => ({
  Client: jest.fn().mockImplementation(() => ({
    connect: mockConnect,
    query: mockQuery,
    end: mockEnd,
  })),
}));

jest.mock("../src/config/env", () => ({
  env: {
    NODE_ENV: "test",
    DATABASE_HOST: "localhost",
    DATABASE_PORT: 5432,
    DATABASE_NAME: "library_management",
    DATABASE_USER: "postgres",
    DATABASE_PASSWORD: "test-password",
  },
}));

import { Client } from "pg";
import { env } from "../src/config/env";
import { provisionDatabaseIfNeeded } from "../src/config/database-provisioner";

describe("provisionDatabaseIfNeeded", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnect.mockResolvedValue(undefined);
    mockEnd.mockResolvedValue(undefined);
  });

  it("creates the database when it does not exist", async () => {
    mockQuery
      .mockResolvedValueOnce({ rowCount: 0, rows: [] })
      .mockResolvedValueOnce({ rowCount: null, rows: [] });

    await provisionDatabaseIfNeeded();

    expect(Client).toHaveBeenCalledWith(
      expect.objectContaining({ database: "postgres" }),
    );
    expect(mockQuery).toHaveBeenNthCalledWith(
      1,
      "SELECT 1 FROM pg_database WHERE datname = $1",
      ["library_management"],
    );
    expect(mockQuery).toHaveBeenNthCalledWith(
      2,
      'CREATE DATABASE "library_management"',
    );
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });

  it("does not create the database when it already exists", async () => {
    mockQuery.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ "?column?": 1 }],
    });

    await provisionDatabaseIfNeeded();

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).not.toHaveBeenCalledWith(
      'CREATE DATABASE "library_management"',
    );
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });

  it("does not attempt automatic database creation in production", async () => {
    (env as { NODE_ENV: string }).NODE_ENV = "production";

    await provisionDatabaseIfNeeded();

    expect(Client).not.toHaveBeenCalled();

    (env as { NODE_ENV: string }).NODE_ENV = "test";
  });

  it("rejects an unsafe database identifier", async () => {
    (env as { DATABASE_NAME: string }).DATABASE_NAME =
      "library; DROP DATABASE postgres";

    await expect(provisionDatabaseIfNeeded()).rejects.toThrow(
      "DATABASE_NAME must start with a letter or underscore",
    );
    expect(Client).not.toHaveBeenCalled();

    (env as { DATABASE_NAME: string }).DATABASE_NAME = "library_management";
  });

  it("does not try to end the client when connection fails", async () => {
    mockConnect.mockRejectedValueOnce(new Error("Connection failed"));

    await expect(provisionDatabaseIfNeeded()).rejects.toThrow(
      "Connection failed",
    );

    expect(mockQuery).not.toHaveBeenCalled();
    expect(mockEnd).not.toHaveBeenCalled();
  });
});

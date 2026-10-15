import type { QueryRunner } from "typeorm";
import { InitialSchema1792065600000 } from "../src/migrations/1792065600000-InitialSchema";

describe("InitialSchema migration", () => {
  function createQueryRunner() {
    const statements: string[] = [];
    const queryRunner = {
      query: jest.fn(async (sql: string) => {
        statements.push(sql);
        return undefined;
      }),
    };
    return { queryRunner: queryRunner as unknown as QueryRunner, statements, query: queryRunner.query };
  }

  it("creates all six tables and critical integrity indexes", async () => {
    const migration = new InitialSchema1792065600000();
    const { queryRunner, statements } = createQueryRunner();

    await migration.up(queryRunner);

    const sql = statements.join("\n");
    for (const table of [
      "users",
      "authors",
      "books",
      "book_authors",
      "book_copies",
      "borrowings",
    ]) {
      expect(sql).toContain(`CREATE TABLE "${table}"`);
    }

    expect(sql).toContain('LOWER("email")');
    expect(sql).toContain(`"role" IN ('STUDENT', 'LIBRARIAN')`);
    expect(sql).toContain('"publication_year" >= 1000');
    expect(sql).toContain('"due_at" > "issued_at"');
    expect(sql).toContain('"returned_at" IS NULL');
    expect(sql).toContain('CREATE UNIQUE INDEX "uq_borrowings_active_copy"');
  });

  it("drops dependent tables before their referenced tables", async () => {
    const migration = new InitialSchema1792065600000();
    const { queryRunner, statements } = createQueryRunner();

    await migration.down(queryRunner);

    expect(statements).toEqual([
      'DROP TABLE "borrowings"',
      'DROP TABLE "book_copies"',
      'DROP TABLE "book_authors"',
      'DROP TABLE "books"',
      'DROP TABLE "authors"',
      'DROP TABLE "users"',
    ]);
  });
});

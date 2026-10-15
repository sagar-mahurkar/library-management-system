import { randomUUID } from "node:crypto";
import { IsNull } from "typeorm";
import { AppDataSource } from "../src/config/data-source";
import { env } from "../src/config/env";
import { Book } from "../src/entities/book.entity";
import { BookCopy } from "../src/entities/book-copy.entity";
import { Borrowing } from "../src/entities/borrowing.entity";
import { User } from "../src/entities/user.entity";
import { BorrowingsRepository } from "../src/modules/borrowings/borrowings.repository";
import { BorrowingsService } from "../src/modules/borrowings/borrowings.service";

const enabled = process.env.RUN_DB_INTEGRATION_TESTS === "true";
const integrationDescribe = enabled ? describe : describe.skip;

describe("borrowing database integration test configuration", () => {
  it("requires explicit opt-in because these tests use a real PostgreSQL database", () => {
    expect(enabled).toBe(process.env.RUN_DB_INTEGRATION_TESTS === "true");
  });
});

integrationDescribe("borrowing database integrity (dedicated test database only)", () => {
  const repository = new BorrowingsRepository();
  const service = new BorrowingsService(repository);
  let userId: string;
  let bookId: string;
  let copyId: string;

  beforeAll(async () => {
    if (!/(^|[_-])test([_-]|$)/i.test(env.DATABASE_TEST_NAME)) {
      throw new Error(`Refusing database integration tests: DATABASE_NAME must clearly identify a test database; got ${env.DATABASE_NAME}`);
    }
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    await AppDataSource.runMigrations();
  });

  beforeEach(async () => {
    const suffix = randomUUID();
    const user = await AppDataSource.getRepository(User).save(AppDataSource.getRepository(User).create({
      name: "Integration Student", email: `integration-${suffix}@example.test`, passwordHash: "test-hash", role: "STUDENT",
    }));
    const book = await AppDataSource.getRepository(Book).save(AppDataSource.getRepository(Book).create({
      title: `Integration Book ${suffix}`, isbn: null, publisher: null, publicationYear: null,
    }));
    const copy = await AppDataSource.getRepository(BookCopy).save(AppDataSource.getRepository(BookCopy).create({
      bookId: book.id, copyCode: `IT-${suffix}`,
    }));
    userId = user.id;
    bookId = book.id;
    copyId = copy.id;
  });

  afterEach(async () => {
    if (!AppDataSource.isInitialized) return;
    if (copyId) await AppDataSource.getRepository(Borrowing).delete({ bookCopyId: copyId });
    if (copyId) await AppDataSource.getRepository(BookCopy).delete({ id: copyId });
    if (bookId) await AppDataSource.getRepository(Book).delete({ id: bookId });
    if (userId) await AppDataSource.getRepository(User).delete({ id: userId });
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  it("persists an issue and return, then permits the copy to be issued again", async () => {
    const dueAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const issued = await service.issue({ studentId: userId, bookCopyId: copyId, dueAt });
    expect(issued.id).toBeDefined();
    expect(issued.overdue).toBe(false);

    const returned = await service.return(issued.id);
    expect(returned.returnedAt).not.toBeNull();

    const reissued = await service.issue({ studentId: userId, bookCopyId: copyId, dueAt });
    expect(reissued.id).not.toBe(issued.id);

    const persisted = await AppDataSource.getRepository(Borrowing).find({ where: { bookCopyId: copyId }, order: { issuedAt: "ASC" } });
    expect(persisted).toHaveLength(2);
    expect(persisted[0].returnedAt).not.toBeNull();
    expect(persisted[1].returnedAt).toBeNull();
  });

  it("prevents two active borrowings for the same physical copy", async () => {
    const dueAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await service.issue({ studentId: userId, bookCopyId: copyId, dueAt });
    await expect(service.issue({ studentId: userId, bookCopyId: copyId, dueAt }))
      .rejects.toMatchObject({ statusCode: 409, code: "COPY_UNAVAILABLE" });
    const activeCount = await AppDataSource.getRepository(Borrowing).count({ where: { bookCopyId: copyId, returnedAt: IsNull() } });
    expect(activeCount).toBe(1);
  });
});

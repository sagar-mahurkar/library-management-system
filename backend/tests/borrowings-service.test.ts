import { BorrowingsService, BorrowingsServiceError } from "../src/modules/borrowings/borrowings.service";
import type { BorrowingsRepository } from "../src/modules/borrowings/borrowings.repository";

const baseBorrowing = {
  id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4043",
  userId: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4042",
  bookCopyId: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4044",
  issuedAt: new Date("2026-10-01T10:00:00.000Z"),
  dueAt: new Date("2026-10-20T10:00:00.000Z"),
  returnedAt: null as Date | null,
  user: { id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4042", name: "Student", email: "student@example.com" },
  bookCopy: { id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4044", copyCode: "COPY-1", book: { id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4045", title: "Test Book", isbn: null } },
};

describe("BorrowingsService", () => {
  const repository = {
    issue: jest.fn(),
    returnBorrowing: jest.fn(),
    listForStudent: jest.fn(),
  };
  const service = new BorrowingsService(repository as unknown as BorrowingsRepository);

  beforeEach(() => jest.resetAllMocks());

  it("translates a repository copy-unavailable error into a conflict", async () => {
    repository.issue.mockRejectedValue(new Error("COPY_UNAVAILABLE"));
    await expect(service.issue({ studentId: baseBorrowing.userId, bookCopyId: baseBorrowing.bookCopyId, dueAt: "2026-10-20T10:00:00.000Z" }))
      .rejects.toMatchObject({ statusCode: 409, code: "COPY_UNAVAILABLE" });
  });

  it("translates a unique-index violation into a copy-unavailable conflict", async () => {
    repository.issue.mockRejectedValue({ code: "23505" });
    await expect(service.issue({ studentId: baseBorrowing.userId, bookCopyId: baseBorrowing.bookCopyId, dueAt: "2026-10-20T10:00:00.000Z" }))
      .rejects.toBeInstanceOf(BorrowingsServiceError);
  });

  it("marks an unreturned borrowing overdue when its due date is in the past", async () => {
    repository.listForStudent.mockResolvedValue({ items: [{ ...baseBorrowing, dueAt: new Date("2020-01-01T00:00:00.000Z") }], total: 1 });
    const result = await service.listForStudent(baseBorrowing.userId, { page: 1, limit: 20, status: "all" });
    expect(result.data[0].overdue).toBe(true);
    expect(result.meta.total).toBe(1);
  });

  it("does not mark a returned borrowing overdue", async () => {
    repository.listForStudent.mockResolvedValue({ items: [{ ...baseBorrowing, dueAt: new Date("2020-01-01T00:00:00.000Z"), returnedAt: new Date("2020-01-02T00:00:00.000Z") }], total: 1 });
    const result = await service.listForStudent(baseBorrowing.userId, { page: 1, limit: 20, status: "all" });
    expect(result.data[0].overdue).toBe(false);
  });

  it("does not swallow unexpected repository errors", async () => {
    const failure = new Error("database unavailable");
    repository.returnBorrowing.mockRejectedValue(failure);
    await expect(service.return(baseBorrowing.id)).rejects.toBe(failure);
  });
});

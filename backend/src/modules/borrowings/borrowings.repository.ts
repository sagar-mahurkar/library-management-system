import { AppDataSource } from "../../config/data-source";
import { BookCopy } from "../../entities/book-copy.entity";
import { Borrowing } from "../../entities/borrowing.entity";
import { User } from "../../entities/user.entity";
import type { IssueBorrowingInput, ListBorrowingsQuery } from "./borrowings.schemas";
export class BorrowingsRepository {
  async issue(input: IssueBorrowingInput) {
    return AppDataSource.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOne({ where: { id: input.studentId, role: "STUDENT" } });
      if (!user) throw new Error("STUDENT_NOT_FOUND");
      const copy = await manager.getRepository(BookCopy).findOne({ where: { id: input.bookCopyId }, lock: { mode: "pessimistic_write" } });
      if (!copy) throw new Error("COPY_NOT_FOUND");
      const active = await manager.getRepository(Borrowing).createQueryBuilder("borrowing")
        .where("borrowing.book_copy_id = :copyId", { copyId: copy.id })
        .andWhere("borrowing.returned_at IS NULL")
        .getOne();
      if (active) throw new Error("COPY_UNAVAILABLE");
      const dueAt = new Date(input.dueAt);
      if (dueAt <= new Date()) throw new Error("INVALID_DUE_DATE");
      return manager.getRepository(Borrowing).save(manager.getRepository(Borrowing).create({ userId: user.id, bookCopyId: copy.id, dueAt, returnedAt: null }));
    });
  }
  async returnBorrowing(id: string) {
    return AppDataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Borrowing);
      const borrowing = await repo.findOne({ where: { id }, lock: { mode: "pessimistic_write" } });
      if (!borrowing) throw new Error("BORROWING_NOT_FOUND");
      if (borrowing.returnedAt) throw new Error("ALREADY_RETURNED");
      borrowing.returnedAt = new Date();
      return repo.save(borrowing);
    });
  }
  async listForStudent(studentId: string, query: ListBorrowingsQuery) {
    const qb = AppDataSource.getRepository(Borrowing).createQueryBuilder("borrowing")
      .leftJoinAndSelect("borrowing.bookCopy", "copy").leftJoinAndSelect("copy.book", "book")
      .leftJoinAndSelect("borrowing.user", "user").where("borrowing.user_id = :studentId", { studentId })
      .orderBy("borrowing.issuedAt", "DESC").skip((query.page - 1) * query.limit).take(query.limit);
    if (query.status === "active") qb.andWhere("borrowing.returned_at IS NULL");
    if (query.status === "overdue") qb.andWhere("borrowing.returned_at IS NULL AND borrowing.due_at < CURRENT_TIMESTAMP");
    if (query.status === "returned") qb.andWhere("borrowing.returned_at IS NOT NULL");
    const [items, total] = await qb.getManyAndCount(); return { items, total };
  }
}
export const borrowingsRepository = new BorrowingsRepository();

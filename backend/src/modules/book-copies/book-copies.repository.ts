import { AppDataSource } from "../../config/data-source";
import { Book } from "../../entities/book.entity";
import { BookCopy } from "../../entities/book-copy.entity";
import { Borrowing } from "../../entities/borrowing.entity";
import type { CreateBookCopyInput } from "./book-copies.schemas";
export class BookCopiesRepository {
  private get repository() { return AppDataSource.getRepository(BookCopy); }
  async listForBook(bookId: string) {
    return this.repository.createQueryBuilder("copy").leftJoin("copy.borrowings", "borrowing", "borrowing.returnedAt IS NULL").addSelect("borrowing.id").where("copy.book_id = :bookId", { bookId }).orderBy("copy.copyCode", "ASC").getMany();
  }
  async bookExists(bookId: string) { return Boolean(await AppDataSource.getRepository(Book).findOne({ where: { id: bookId } })); }
  async create(bookId: string, input: CreateBookCopyInput) { return this.repository.save(this.repository.create({ bookId, copyCode: input.copyCode })); }
  async remove(id: string) { return AppDataSource.transaction(async (manager) => { const repo = manager.getRepository(BookCopy); const copy = await repo.findOne({ where: { id } }); if (!copy) return false; const history = await manager.getRepository(Borrowing).findOne({ where: { bookCopyId: id } }); if (history) throw new Error("COPY_HAS_HISTORY"); await repo.delete({ id }); return true; }); }
  async listAvailability(bookId: string) {
    const rows = await AppDataSource.getRepository(BookCopy).createQueryBuilder("copy").leftJoin("copy.borrowings", "borrowing", "borrowing.returnedAt IS NULL").select("copy.id", "id").addSelect("copy.book_id", "bookId").addSelect("copy.copy_code", "copyCode").addSelect("CASE WHEN borrowing.id IS NULL THEN true ELSE false END", "available").where("copy.book_id = :bookId", { bookId }).orderBy("copy.copy_code", "ASC").getRawMany();
    return rows.map((row) => ({ ...row, available: row.available === true || row.available === "true" }));
  }
}
export const bookCopiesRepository = new BookCopiesRepository();

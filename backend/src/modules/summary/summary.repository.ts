import { AppDataSource } from "../../config/data-source";
import { Book } from "../../entities/book.entity";
import { BookCopy } from "../../entities/book-copy.entity";
import { Borrowing } from "../../entities/borrowing.entity";

export interface LibrarySummary {
  totalBooks: number;
  totalCopies: number;
  availableCopies: number;
  activeBorrowings: number;
  overdueBorrowings: number;
}

export class SummaryRepository {
  async getSummary(): Promise<LibrarySummary> {
    const bookRepository = AppDataSource.getRepository(Book);
    const copyRepository = AppDataSource.getRepository(BookCopy);
    const borrowingRepository = AppDataSource.getRepository(Borrowing);

    const [totalBooks, totalCopies, availableCopies, activeBorrowings, overdueBorrowings] =
      await Promise.all([
        bookRepository.count(),
        copyRepository.count(),
        copyRepository
          .createQueryBuilder("copy")
          .leftJoin("copy.borrowings", "borrowing", "borrowing.returnedAt IS NULL")
          .where("borrowing.id IS NULL")
          .getCount(),
        borrowingRepository
          .createQueryBuilder("borrowing")
          .where("borrowing.returned_at IS NULL")
          .getCount(),
        borrowingRepository
          .createQueryBuilder("borrowing")
          .where("borrowing.returned_at IS NULL")
          .andWhere("borrowing.due_at < CURRENT_TIMESTAMP")
          .getCount(),
      ]);

    return {
      totalBooks,
      totalCopies,
      availableCopies,
      activeBorrowings,
      overdueBorrowings,
    };
  }
}

export const summaryRepository = new SummaryRepository();

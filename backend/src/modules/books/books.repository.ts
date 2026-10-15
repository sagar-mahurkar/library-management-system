import { AppDataSource } from "../../config/data-source";
import { Author } from "../../entities/author.entity";
import { BookAuthor } from "../../entities/book-author.entity";
import { Book } from "../../entities/book.entity";
import { In } from "typeorm";
import { Borrowing } from "../../entities/borrowing.entity";
import type { CreateBookInput, ListBooksQuery, UpdateBookInput } from "./books.schemas";

export class BooksRepository {
  private get repository() { return AppDataSource.getRepository(Book); }

  async list(query: ListBooksQuery) {
    const qb = this.repository.createQueryBuilder("book")
      .leftJoinAndSelect("book.bookAuthors", "bookAuthor")
      .leftJoinAndSelect("bookAuthor.author", "author")
      .leftJoinAndSelect("book.copies", "copy")
      .leftJoinAndSelect("copy.borrowings", "borrowing", "borrowing.returnedAt IS NULL")
      .distinct(true)
      .orderBy("book.title", "ASC")
      .skip((query.page - 1) * query.limit)
      .take(query.limit);
    if (query.search) qb.andWhere("(book.title ILIKE :search OR book.isbn ILIKE :search OR author.name ILIKE :search)", { search: `%${query.search}%` });
    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  findById(id: string): Promise<Book | null> {
    return this.repository.findOne({
      where: { id },
      relations: { bookAuthors: { author: true }, copies: { borrowings: true } },
    });
  }

  async create(input: CreateBookInput): Promise<Book> {
    return AppDataSource.transaction(async (manager) => {
      const authorRepo = manager.getRepository(Author);
      const authors = await authorRepo.find({ where: { id: In(input.authorIds) } });
      if (authors.length !== input.authorIds.length) throw new Error("AUTHOR_NOT_FOUND");
      const repo = manager.getRepository(Book);
      const book = await repo.save(repo.create({
        title: input.title,
        isbn: input.isbn === undefined ? null : input.isbn,
        publisher: input.publisher === undefined ? null : input.publisher,
        publicationYear: input.publicationYear === undefined ? null : input.publicationYear,
      }));
      await manager.getRepository(BookAuthor).save(authors.map((author) => ({ bookId: book.id, authorId: author.id })));
      return (await repo.findOneOrFail({ where: { id: book.id }, relations: { bookAuthors: { author: true }, copies: true } }));
    });
  }

  async update(id: string, input: UpdateBookInput): Promise<Book | null> {
    return AppDataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Book);
      const book = await repo.findOne({ where: { id } });
      if (!book) return null;
      if (input.title !== undefined) book.title = input.title;
      if (input.isbn !== undefined) book.isbn = input.isbn;
      if (input.publisher !== undefined) book.publisher = input.publisher;
      if (input.publicationYear !== undefined) book.publicationYear = input.publicationYear;
      await repo.save(book);
      if (input.authorIds !== undefined) {
        const authors = await manager.getRepository(Author).find({ where: { id: In(input.authorIds) } });
        if (authors.length !== input.authorIds.length) throw new Error("AUTHOR_NOT_FOUND");
        await manager.getRepository(BookAuthor).delete({ bookId: id });
        await manager.getRepository(BookAuthor).save(authors.map((author) => ({ bookId: id, authorId: author.id })));
      }
      return repo.findOne({ where: { id }, relations: { bookAuthors: { author: true }, copies: { borrowings: true } } });
    });
  }

  async remove(id: string): Promise<boolean> {
    return AppDataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Book);
      const book = await repo.findOne({ where: { id }, relations: { copies: true } });
      if (!book) return false;
      if (book.copies.length > 0) throw new Error("BOOK_HAS_COPIES");
      await manager.getRepository(BookAuthor).delete({ bookId: id });
      await repo.delete({ id });
      return true;
    });
  }
}
export const booksRepository = new BooksRepository();

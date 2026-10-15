import "reflect-metadata";
import { getMetadataArgsStorage } from "typeorm";
import { Author } from "../src/entities/author.entity";
import { Book } from "../src/entities/book.entity";
import { BookAuthor } from "../src/entities/book-author.entity";
import { BookCopy } from "../src/entities/book-copy.entity";
import { Borrowing } from "../src/entities/borrowing.entity";
import { User } from "../src/entities/user.entity";

describe("Phase 5 entity mappings", () => {
  const storage = getMetadataArgsStorage();

  function tableName(target: Function): string | undefined {
    return storage.tables.find((table) => table.target === target)?.name;
  }

  function columnNames(target: Function): string[] {
    return storage.columns
      .filter((column) => column.target === target)
      .map((column) => String(column.options.name ?? column.propertyName));
  }

  it("maps all six approved tables", () => {
    expect(tableName(User)).toBe("users");
    expect(tableName(Author)).toBe("authors");
    expect(tableName(Book)).toBe("books");
    expect(tableName(BookAuthor)).toBe("book_authors");
    expect(tableName(BookCopy)).toBe("book_copies");
    expect(tableName(Borrowing)).toBe("borrowings");
  });

  it("maps database snake_case columns explicitly", () => {
    expect(columnNames(User)).toEqual(
      expect.arrayContaining(["password_hash", "created_at", "updated_at"]),
    );
    expect(columnNames(Book)).toEqual(
      expect.arrayContaining(["publication_year", "created_at", "updated_at"]),
    );
    expect(columnNames(BookCopy)).toEqual(
      expect.arrayContaining(["book_id", "copy_code"]),
    );
    expect(columnNames(Borrowing)).toEqual(
      expect.arrayContaining([
        "user_id",
        "book_copy_id",
        "issued_at",
        "due_at",
        "returned_at",
      ]),
    );
  });

  it("declares the junction composite key", () => {
    const primaryColumns = storage.columns
      .filter((column) => column.target === BookAuthor && column.options.primary)
      .map((column) => column.options.name);

    expect(primaryColumns).toEqual(expect.arrayContaining(["book_id", "author_id"]));
  });

  it("declares the active-borrowing partial unique index", () => {
    const index = storage.indices.find(
      (item) => item.target === Borrowing && item.name === "uq_borrowings_active_copy",
    );

    expect(index).toBeDefined();
    expect(index?.unique).toBe(true);
    expect(index?.where).toBe('"returned_at" IS NULL');
  });
});

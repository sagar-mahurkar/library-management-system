/*
 * The many-to-many junction is managed by Book's @JoinTable metadata.
 * This mapping documents the junction's composite key for explicit access
 * when needed. The initial migration is authoritative for referential actions.
 */
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Author } from "./author.entity";
import { Book } from "./book.entity";

@Entity({ name: "book_authors" })
export class BookAuthor {
  @PrimaryColumn({ type: "uuid", name: "book_id" })
  bookId!: string;

  @PrimaryColumn({ type: "uuid", name: "author_id" })
  authorId!: string;

  @ManyToOne(() => Book, { onDelete: "CASCADE" })
  @JoinColumn({ name: "book_id", referencedColumnName: "id" })
  book!: Book;

  @ManyToOne(() => Author, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "author_id", referencedColumnName: "id" })
  author!: Author;
}

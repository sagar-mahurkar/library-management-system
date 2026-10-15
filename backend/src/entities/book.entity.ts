import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BookAuthor } from "./book-author.entity";
import { BookCopy } from "./book-copy.entity";

@Entity({ name: "books" })
@Check(
  "CHK_books_publication_year_min",
  `"publication_year" IS NULL OR "publication_year" >= 1000`,
)
@Index("idx_books_title", ["title"])
export class Book {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "varchar", length: 20, nullable: true, unique: true })
  isbn!: string | null;

  @Column({ type: "varchar", length: 150, nullable: true })
  publisher!: string | null;

  @Column({
    type: "smallint",
    name: "publication_year",
    nullable: true,
  })
  publicationYear!: number | null;

  @OneToMany(() => BookAuthor, (bookAuthor) => bookAuthor.book)
  bookAuthors!: BookAuthor[];

  @OneToMany(() => BookCopy, (copy) => copy.book)
  copies!: BookCopy[];

  @CreateDateColumn({
    type: "timestamptz",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: "timestamptz",
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}

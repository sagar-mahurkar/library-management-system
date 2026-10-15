import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Book } from "./book.entity";
import { Borrowing } from "./borrowing.entity";

@Entity({ name: "book_copies" })
@Index("idx_book_copies_book_id", ["bookId"])
export class BookCopy {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", name: "book_id" })
  bookId!: string;

  @Column({ type: "varchar", length: 50, name: "copy_code", unique: true })
  copyCode!: string;

  @ManyToOne(() => Book, (book) => book.copies, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "book_id", referencedColumnName: "id" })
  book!: Book;

  @OneToMany(() => Borrowing, (borrowing) => borrowing.bookCopy)
  borrowings!: Borrowing[];

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

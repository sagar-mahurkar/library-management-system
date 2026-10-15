import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BookCopy } from "./book-copy.entity";
import { User } from "./user.entity";

@Entity({ name: "borrowings" })
@Check("CHK_borrowings_due_after_issue", `"due_at" > "issued_at"`)
@Check(
  "CHK_borrowings_return_after_issue",
  `"returned_at" IS NULL OR "returned_at" >= "issued_at"`,
)
@Index("idx_borrowings_user_issued_at", ["userId", "issuedAt"])
@Index("idx_borrowings_active_due_at", ["dueAt"], {
  where: '"returned_at" IS NULL',
})
@Index("uq_borrowings_active_copy", ["bookCopyId"], {
  unique: true,
  where: '"returned_at" IS NULL',
})
export class Borrowing {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", name: "user_id" })
  userId!: string;

  @Column({ type: "uuid", name: "book_copy_id" })
  bookCopyId!: string;

  @Column({
    type: "timestamptz",
    name: "issued_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  issuedAt!: Date;

  @Column({ type: "timestamptz", name: "due_at" })
  dueAt!: Date;

  @Column({ type: "timestamptz", name: "returned_at", nullable: true })
  returnedAt!: Date | null;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user!: User;

  @ManyToOne(() => BookCopy, (copy) => copy.borrowings, {
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "book_copy_id", referencedColumnName: "id" })
  bookCopy!: BookCopy;

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

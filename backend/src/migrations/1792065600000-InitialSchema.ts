import type { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1792065600000 implements MigrationInterface {
  name = "InitialSchema1792065600000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" varchar(100) NOT NULL,
        "email" varchar(255) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "role" varchar(20) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_users_role" CHECK ("role" IN ('STUDENT', 'LIBRARIAN'))
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_users_email_lower" ON "users" (LOWER("email"))
    `);

    await queryRunner.query(`
      CREATE TABLE "authors" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" varchar(150) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_authors_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "books" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" varchar(255) NOT NULL,
        "isbn" varchar(20),
        "publisher" varchar(150),
        "publication_year" smallint,
        "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_books_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_books_isbn" UNIQUE ("isbn"),
        CONSTRAINT "CHK_books_publication_year_min"
          CHECK ("publication_year" IS NULL OR "publication_year" >= 1000)
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_books_title" ON "books" ("title")`);

    await queryRunner.query(`
      CREATE TABLE "book_authors" (
        "book_id" uuid NOT NULL,
        "author_id" uuid NOT NULL,
        CONSTRAINT "PK_book_authors" PRIMARY KEY ("book_id", "author_id"),
        CONSTRAINT "FK_book_authors_book" FOREIGN KEY ("book_id")
          REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_book_authors_author" FOREIGN KEY ("author_id")
          REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_book_authors_author_id" ON "book_authors" ("author_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "book_copies" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "book_id" uuid NOT NULL,
        "copy_code" varchar(50) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_book_copies_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_book_copies_copy_code" UNIQUE ("copy_code"),
        CONSTRAINT "FK_book_copies_book" FOREIGN KEY ("book_id")
          REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_book_copies_book_id" ON "book_copies" ("book_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "borrowings" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "book_copy_id" uuid NOT NULL,
        "issued_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "due_at" timestamptz NOT NULL,
        "returned_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_borrowings_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_borrowings_due_after_issue" CHECK ("due_at" > "issued_at"),
        CONSTRAINT "CHK_borrowings_return_after_issue"
          CHECK ("returned_at" IS NULL OR "returned_at" >= "issued_at"),
        CONSTRAINT "FK_borrowings_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
        CONSTRAINT "FK_borrowings_book_copy" FOREIGN KEY ("book_copy_id")
          REFERENCES "book_copies"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_borrowings_user_issued_at" ON "borrowings" ("user_id", "issued_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_borrowings_active_due_at" ON "borrowings" ("due_at") WHERE "returned_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_borrowings_active_copy" ON "borrowings" ("book_copy_id") WHERE "returned_at" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "borrowings"`);
    await queryRunner.query(`DROP TABLE "book_copies"`);
    await queryRunner.query(`DROP TABLE "book_authors"`);
    await queryRunner.query(`DROP TABLE "books"`);
    await queryRunner.query(`DROP TABLE "authors"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}

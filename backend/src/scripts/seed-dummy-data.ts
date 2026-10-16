import { AppDataSource } from "../config/data-source";
import { env } from "../config/env";
import { Author } from "../entities/author.entity";
import { BookAuthor } from "../entities/book-author.entity";
import { BookCopy } from "../entities/book-copy.entity";
import { Book } from "../entities/book.entity";
import { Borrowing } from "../entities/borrowing.entity";
import { User } from "../entities/user.entity";
import { hashPassword } from "../utils/password";

const DEMO_STUDENT_PASSWORD =
  process.env.DUMMY_STUDENT_PASSWORD ?? "Password123!";

const students = [
  { name: "Aarav Sharma", email: "aarav.sharma@library-demo.com" },
  { name: "Ananya Patel", email: "ananya.patel@library-demo.com" },
  { name: "Rohan Mehta", email: "rohan.mehta@library-demo.com" },
  { name: "Priya Nair", email: "priya.nair@library-demo.com" },
  { name: "Ishaan Gupta", email: "ishaan.gupta@library-demo.com" },
  { name: "Kavya Iyer", email: "kavya.iyer@library-demo.com" },
  { name: "Arjun Desai", email: "arjun.desai@library-demo.com" },
  { name: "Meera Joshi", email: "meera.joshi@library-demo.com" },
];

const authorNames = [
  "George Orwell",
  "Jane Austen",
  "J. R. R. Tolkien",
  "Agatha Christie",
  "R. K. Narayan",
  "Mary Shelley",
  "Arthur Conan Doyle",
  "Virginia Woolf",
];

const bookSeeds = [
  { title: "1984", isbn: "9780000000001", publisher: "Demo Press", publicationYear: 1949, author: "George Orwell" },
  { title: "Animal Farm", isbn: "9780000000002", publisher: "Demo Press", publicationYear: 1945, author: "George Orwell" },
  { title: "Pride and Prejudice", isbn: "9780000000003", publisher: "Demo Press", publicationYear: 1813, author: "Jane Austen" },
  { title: "The Hobbit", isbn: "9780000000004", publisher: "Demo Press", publicationYear: 1937, author: "J. R. R. Tolkien" },
  { title: "Murder on the Orient Express", isbn: "9780000000005", publisher: "Demo Press", publicationYear: 1934, author: "Agatha Christie" },
  { title: "The Guide", isbn: "9780000000006", publisher: "Demo Press", publicationYear: 1958, author: "R. K. Narayan" },
  { title: "Frankenstein", isbn: "9780000000007", publisher: "Demo Press", publicationYear: 1818, author: "Mary Shelley" },
  { title: "The Hound of the Baskervilles", isbn: "9780000000008", publisher: "Demo Press", publicationYear: 1902, author: "Arthur Conan Doyle" },
  { title: "Mrs Dalloway", isbn: "9780000000009", publisher: "Demo Press", publicationYear: 1925, author: "Virginia Woolf" },
  { title: "The Fellowship of the Ring", isbn: "9780000000010", publisher: "Demo Press", publicationYear: 1954, author: "J. R. R. Tolkien" },
];

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function seedDummyData(): Promise<void> {
  if (env.NODE_ENV === "production") {
    throw new Error("Dummy-data seeding is disabled in production.");
  }

  if (process.env.ALLOW_DUMMY_DATA_SEED !== "true") {
    throw new Error(
      "Set ALLOW_DUMMY_DATA_SEED=true to explicitly allow dummy-data seeding.",
    );
  }

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // This script is explicit/manual. Apply migrations before seeding so the
  // target schema is current. Do not enable synchronize.
  await AppDataSource.runMigrations();

  await AppDataSource.transaction(async (manager) => {
    const userRepository = manager.getRepository(User);
    const authorRepository = manager.getRepository(Author);
    const bookRepository = manager.getRepository(Book);
    const bookAuthorRepository = manager.getRepository(BookAuthor);
    const copyRepository = manager.getRepository(BookCopy);
    const borrowingRepository = manager.getRepository(Borrowing);

    const passwordHash = await hashPassword(DEMO_STUDENT_PASSWORD);
    const studentByEmail = new Map<string, User>();

    for (const studentSeed of students) {
      const email = studentSeed.email.toLowerCase();
      let student = await userRepository.findOneBy({ email });

      if (!student) {
        student = await userRepository.save(
          userRepository.create({
            ...studentSeed,
            email,
            passwordHash,
            role: "STUDENT",
          }),
        );
      } else if (student.role !== "STUDENT") {
        throw new Error(`Demo email ${email} exists but is not a STUDENT account.`);
      }

      studentByEmail.set(email, student);
    }

    const authorByName = new Map<string, Author>();
    for (const name of authorNames) {
      let author = await authorRepository.findOneBy({ name });
      if (!author) {
        author = await authorRepository.save(authorRepository.create({ name }));
      }
      authorByName.set(name, author);
    }

    const copiesByCode = new Map<string, BookCopy>();

    for (const [bookIndex, bookSeed] of bookSeeds.entries()) {
      let book = await bookRepository.findOneBy({ isbn: bookSeed.isbn });
      if (!book) {
        book = await bookRepository.save(
          bookRepository.create({
            title: bookSeed.title,
            isbn: bookSeed.isbn,
            publisher: bookSeed.publisher,
            publicationYear: bookSeed.publicationYear,
          }),
        );
      }

      const author = authorByName.get(bookSeed.author);
      if (!author) throw new Error(`Missing seeded author: ${bookSeed.author}`);

      const link = await bookAuthorRepository.findOneBy({
        bookId: book.id,
        authorId: author.id,
      });
      if (!link) {
        await bookAuthorRepository.save(
          bookAuthorRepository.create({ bookId: book.id, authorId: author.id }),
        );
      }

      for (let copyNumber = 1; copyNumber <= 2; copyNumber += 1) {
        const copyCode = `DEMO-${String(bookIndex + 1).padStart(2, "0")}-${copyNumber}`;
        let copy = await copyRepository.findOneBy({ copyCode });
        if (!copy) {
          copy = await copyRepository.save(
            copyRepository.create({ bookId: book.id, copyCode }),
          );
        } else if (copy.bookId !== book.id) {
          throw new Error(`Copy code ${copyCode} already belongs to a different book.`);
        }
        copiesByCode.set(copyCode, copy);
      }
    }

    // Seed deterministic examples: active, overdue, and returned records.
    // Existing user/copy pairs are left untouched on subsequent runs.
    const borrowingSeeds = [
      { student: 0, copyCode: "DEMO-01-1", issueDaysAgo: 2, dueDaysFromNow: 12, returned: false },
      { student: 1, copyCode: "DEMO-02-1", issueDaysAgo: 3, dueDaysFromNow: 11, returned: false },
      { student: 2, copyCode: "DEMO-03-1", issueDaysAgo: 18, dueDaysFromNow: -4, returned: false },
      { student: 3, copyCode: "DEMO-04-1", issueDaysAgo: 20, dueDaysFromNow: -6, returned: false },
      { student: 4, copyCode: "DEMO-05-1", issueDaysAgo: 5, dueDaysFromNow: 9, returned: false },
      { student: 5, copyCode: "DEMO-06-1", issueDaysAgo: 15, dueDaysFromNow: -2, returned: true },
      { student: 6, copyCode: "DEMO-07-1", issueDaysAgo: 10, dueDaysFromNow: 4, returned: true },
      { student: 7, copyCode: "DEMO-08-1", issueDaysAgo: 8, dueDaysFromNow: 6, returned: true },
    ];

    for (const seed of borrowingSeeds) {
      const studentSeed = students[seed.student];
      const student = studentByEmail.get(studentSeed.email);
      const copy = copiesByCode.get(seed.copyCode);
      if (!student || !copy) {
        throw new Error(`Missing demo student or copy for ${seed.copyCode}.`);
      }

      const existing = await borrowingRepository.findOneBy({
        userId: student.id,
        bookCopyId: copy.id,
      });
      if (existing) continue;

      const issuedAt = daysFromNow(-seed.issueDaysAgo);
      const dueAt = daysFromNow(seed.dueDaysFromNow);
      const returnedAt = seed.returned ? daysFromNow(-Math.max(1, seed.issueDaysAgo - 3)) : null;

      await borrowingRepository.save(
        borrowingRepository.create({
          userId: student.id,
          bookCopyId: copy.id,
          issuedAt,
          dueAt,
          returnedAt,
        }),
      );
    }
  });

  console.info("Dummy library data seeded successfully.");
  console.info(`Demo student password: ${DEMO_STUDENT_PASSWORD}`);
}

seedDummyData()
  .catch((error: unknown) => {
    console.error("Dummy-data seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

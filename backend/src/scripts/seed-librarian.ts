import bcrypt from "bcrypt";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../config/data-source";
import { env } from "../config/env";

export async function seedLibrarian(): Promise<void> {
  const { INITIAL_LIBRARIAN_NAME, INITIAL_LIBRARIAN_EMAIL, INITIAL_LIBRARIAN_PASSWORD } =
    env;

  if (
    !INITIAL_LIBRARIAN_NAME ||
    !INITIAL_LIBRARIAN_EMAIL ||
    !INITIAL_LIBRARIAN_PASSWORD
  ) {
    if (env.NODE_ENV === "test") {
      return;
    }

    throw new Error(
      "Initial librarian credentials must be configured in environment variables.",
    );
  }

  const userRepository = AppDataSource.getRepository(User);
  const email = INITIAL_LIBRARIAN_EMAIL.trim().toLowerCase();

  const existingLibrarian = await userRepository
    .createQueryBuilder("user")
    .where("LOWER(user.email) = :email", { email })
    .getOne();

  if (existingLibrarian) {
    console.info("Initial librarian already exists. Skipping seed.");
    return;
  }

  const passwordHash = await bcrypt.hash(INITIAL_LIBRARIAN_PASSWORD, 12);

  const librarian = userRepository.create({
    name: INITIAL_LIBRARIAN_NAME.trim(),
    email,
    passwordHash,
    role: "LIBRARIAN",
  });

  await userRepository.save(librarian);

  console.info("Initial librarian account created successfully.");
}

import bcrypt from "bcrypt";

const BCRYPT_ROUNDS = 12;

/** Hash a password before persistence. Never persist or log plaintext passwords. */
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/** Compare a candidate password with a bcrypt hash stored in the database. */
export function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

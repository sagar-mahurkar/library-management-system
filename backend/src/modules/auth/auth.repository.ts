import { Raw } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import { User } from "../../entities/user.entity";

/** Persistence boundary for authentication; service code does not query TypeORM directly. */
export class AuthRepository {
  private get repository() {
    return AppDataSource.getRepository(User);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email: Raw((alias) => `LOWER(${alias}) = LOWER(:email)`, { email }) } });
  }

  createStudent(input: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const user = this.repository.create({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      // Public registration must never accept or assign a privileged role.
      role: "STUDENT",
    });

    return this.repository.save(user);
  }
}

export const authRepository = new AuthRepository();

import { AppDataSource } from "../../config/data-source";
import { User } from "../../entities/user.entity";
import type { ListStudentsQuery } from "./students.schemas";
const publicStudent = (user: User) => ({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
export class StudentsRepository {
  private get repository() { return AppDataSource.getRepository(User); }
  async list(query: ListStudentsQuery) { const qb = this.repository.createQueryBuilder("user").where("user.role = :role", { role: "STUDENT" }).orderBy("user.name", "ASC").skip((query.page - 1) * query.limit).take(query.limit); if (query.search) qb.andWhere("(user.name ILIKE :search OR user.email ILIKE :search)", { search: `%${query.search}%` }); const [items, total] = await qb.getManyAndCount(); return { items: items.map(publicStudent), total }; }
  async findById(id: string) { const user = await this.repository.findOne({ where: { id, role: "STUDENT" } }); return user ? publicStudent(user) : null; }
}
export const studentsRepository = new StudentsRepository();

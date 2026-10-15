import { AppDataSource } from "../../config/data-source";
import { Author } from "../../entities/author.entity";
import { BookAuthor } from "../../entities/book-author.entity";
import type { CreateAuthorInput, ListAuthorsQuery } from "./authors.schemas";
export class AuthorsRepository {
  private get repository() { return AppDataSource.getRepository(Author); }
  async list(query: ListAuthorsQuery) {
    const qb = this.repository.createQueryBuilder("author").orderBy("author.name", "ASC").skip((query.page - 1) * query.limit).take(query.limit);
    if (query.search) qb.where("author.name ILIKE :search", { search: `%${query.search}%` });
    const [items, total] = await qb.getManyAndCount(); return { items, total };
  }
  findById(id: string) { return this.repository.findOne({ where: { id } }); }
  create(input: CreateAuthorInput) { return this.repository.save(this.repository.create(input)); }
  async update(id: string, name: string) { const author = await this.repository.findOne({ where: { id } }); if (!author) return null; author.name = name; return this.repository.save(author); }
  async remove(id: string) { return AppDataSource.transaction(async (manager) => { const repo = manager.getRepository(Author); const author = await repo.findOne({ where: { id } }); if (!author) return false; const relation = await manager.getRepository(BookAuthor).findOne({ where: { authorId: id } }); if (relation) throw new Error("AUTHOR_IN_USE"); await repo.delete({ id }); return true; }); }
}
export const authorsRepository = new AuthorsRepository();

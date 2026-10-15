import { authorsRepository, AuthorsRepository } from "./authors.repository";
import type { CreateAuthorInput, ListAuthorsQuery } from "./authors.schemas";
export class AuthorsServiceError extends Error { constructor(public readonly statusCode: number, public readonly code: string, message: string) { super(message); this.name = "AuthorsServiceError"; } }
export class AuthorsService {
  constructor(private readonly repository: AuthorsRepository = authorsRepository) {}
  async list(query: ListAuthorsQuery) { const result = await this.repository.list(query); return { data: result.items, meta: { page: query.page, limit: query.limit, total: result.total } }; }
  async getById(id: string) { const author = await this.repository.findById(id); if (!author) throw new AuthorsServiceError(404, "AUTHOR_NOT_FOUND", "Author not found"); return author; }
  async create(input: CreateAuthorInput) { return this.repository.create(input); }
  async update(id: string, name: string) { const author = await this.repository.update(id, name); if (!author) throw new AuthorsServiceError(404, "AUTHOR_NOT_FOUND", "Author not found"); return author; }
  async remove(id: string) { try { if (!(await this.repository.remove(id))) throw new AuthorsServiceError(404, "AUTHOR_NOT_FOUND", "Author not found"); } catch (error) { if (error instanceof AuthorsServiceError) throw error; if (error instanceof Error && error.message === "AUTHOR_IN_USE") throw new AuthorsServiceError(409, "AUTHOR_IN_USE", "Author is associated with one or more books"); throw error; } }
}
export const authorsService = new AuthorsService();

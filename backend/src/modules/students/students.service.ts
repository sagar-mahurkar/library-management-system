import { studentsRepository, StudentsRepository } from "./students.repository";
import type { ListStudentsQuery } from "./students.schemas";
export class StudentsServiceError extends Error { constructor(public readonly statusCode: number, public readonly code: string, message: string) { super(message); this.name = "StudentsServiceError"; } }
export class StudentsService {
  constructor(private readonly repository: StudentsRepository = studentsRepository) {}
  async list(query: ListStudentsQuery) { const result = await this.repository.list(query); return { data: result.items, meta: { page: query.page, limit: query.limit, total: result.total } }; }
  async getById(id: string) { const student = await this.repository.findById(id); if (!student) throw new StudentsServiceError(404, "STUDENT_NOT_FOUND", "Student not found"); return student; }
}
export const studentsService = new StudentsService();

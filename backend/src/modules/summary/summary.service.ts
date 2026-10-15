import { summaryRepository, SummaryRepository } from "./summary.repository";

export class SummaryService {
  constructor(private readonly repository: SummaryRepository = summaryRepository) {}

  getSummary() {
    return this.repository.getSummary();
  }
}

export const summaryService = new SummaryService();

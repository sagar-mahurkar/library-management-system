import { apiClient } from "./apiClient";
import type { ApiEnvelope } from "../types/api.types";
export interface LibrarySummary { totalBooks: number; totalCopies: number; availableCopies: number; activeBorrowings: number; overdueBorrowings: number }
export async function getSummary(): Promise<LibrarySummary> { return (await apiClient.get<ApiEnvelope<LibrarySummary>>("/summary")).data.data; }

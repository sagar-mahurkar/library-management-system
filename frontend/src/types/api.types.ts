export interface ApiEnvelope<T> { data: T; meta?: { page: number; limit: number; total: number } }
export interface ApiErrorBody { error?: { code?: string; message?: string } }
export interface PageMeta { page: number; limit: number; total: number }

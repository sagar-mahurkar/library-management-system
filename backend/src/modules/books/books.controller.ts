import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { BooksServiceError, booksService } from "./books.service";
import { bookIdParamsSchema, createBookSchema, listBooksQuerySchema, updateBookSchema } from "./books.schemas";
function fail(error: unknown, res: Response, next: NextFunction): void {
  if (error instanceof ZodError) { res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Request validation failed", details: error.issues } }); return; }
  if (error instanceof BooksServiceError) { res.status(error.statusCode).json({ error: { code: error.code, message: error.message } }); return; }
  next(error);
}
export async function listBooks(req: Request, res: Response, next: NextFunction) { try { const query = listBooksQuerySchema.parse(req.query); const result = await booksService.list(query); res.status(200).json(result); } catch (e) { fail(e, res, next); } }
export async function getBook(req: Request, res: Response, next: NextFunction) { try { const { id } = bookIdParamsSchema.parse(req.params); res.status(200).json({ data: await booksService.getById(id) }); } catch (e) { fail(e, res, next); } }
export async function createBook(req: Request, res: Response, next: NextFunction) { try { const input = createBookSchema.parse(req.body); res.status(201).json({ data: await booksService.create(input) }); } catch (e) { fail(e, res, next); } }
export async function updateBook(req: Request, res: Response, next: NextFunction) { try { const { id } = bookIdParamsSchema.parse(req.params); const input = updateBookSchema.parse(req.body); res.status(200).json({ data: await booksService.update(id, input) }); } catch (e) { fail(e, res, next); } }
export async function deleteBook(req: Request, res: Response, next: NextFunction) { try { const { id } = bookIdParamsSchema.parse(req.params); await booksService.remove(id); res.status(204).send(); } catch (e) { fail(e, res, next); } }

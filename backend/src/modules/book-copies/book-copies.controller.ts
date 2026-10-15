import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { BookCopiesServiceError, bookCopiesService } from "./book-copies.service";
import { bookCopiesParamsSchema, copyIdParamsSchema, createBookCopySchema } from "./book-copies.schemas";
function fail(error: unknown, res: Response, next: NextFunction): void { if (error instanceof ZodError) { res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Request validation failed", details: error.issues } }); return; } if (error instanceof BookCopiesServiceError) { res.status(error.statusCode).json({ error: { code: error.code, message: error.message } }); return; } next(error); }
export async function listCopies(req: Request, res: Response, next: NextFunction) { try { const { bookId } = bookCopiesParamsSchema.parse(req.params); res.status(200).json(await bookCopiesService.list(bookId)); } catch (e) { fail(e, res, next); } }
export async function createCopy(req: Request, res: Response, next: NextFunction) { try { const { bookId } = bookCopiesParamsSchema.parse(req.params); res.status(201).json({ data: await bookCopiesService.create(bookId, createBookCopySchema.parse(req.body)) }); } catch (e) { fail(e, res, next); } }
export async function deleteCopy(req: Request, res: Response, next: NextFunction) { try { const { id } = copyIdParamsSchema.parse(req.params); await bookCopiesService.remove(id); res.status(204).send(); } catch (e) { fail(e, res, next); } }

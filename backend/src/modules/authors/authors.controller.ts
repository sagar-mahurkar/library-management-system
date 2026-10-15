import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AuthorsServiceError, authorsService } from "./authors.service";
import { authorIdParamsSchema, createAuthorSchema, listAuthorsQuerySchema, updateAuthorSchema } from "./authors.schemas";
function fail(error: unknown, res: Response, next: NextFunction): void { if (error instanceof ZodError) { res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Request validation failed", details: error.issues } }); return; } if (error instanceof AuthorsServiceError) { res.status(error.statusCode).json({ error: { code: error.code, message: error.message } }); return; } next(error); }
export async function listAuthors(req: Request, res: Response, next: NextFunction) { try { res.status(200).json(await authorsService.list(listAuthorsQuerySchema.parse(req.query))); } catch (e) { fail(e, res, next); } }
export async function getAuthor(req: Request, res: Response, next: NextFunction) { try { const { id } = authorIdParamsSchema.parse(req.params); res.status(200).json({ data: await authorsService.getById(id) }); } catch (e) { fail(e, res, next); } }
export async function createAuthor(req: Request, res: Response, next: NextFunction) { try { res.status(201).json({ data: await authorsService.create(createAuthorSchema.parse(req.body)) }); } catch (e) { fail(e, res, next); } }
export async function updateAuthor(req: Request, res: Response, next: NextFunction) { try { const { id } = authorIdParamsSchema.parse(req.params); const { name } = updateAuthorSchema.parse(req.body); res.status(200).json({ data: await authorsService.update(id, name) }); } catch (e) { fail(e, res, next); } }
export async function deleteAuthor(req: Request, res: Response, next: NextFunction) { try { const { id } = authorIdParamsSchema.parse(req.params); await authorsService.remove(id); res.status(204).send(); } catch (e) { fail(e, res, next); } }

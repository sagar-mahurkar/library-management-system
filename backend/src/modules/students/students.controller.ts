import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { StudentsServiceError, studentsService } from "./students.service";
import { listStudentsQuerySchema, studentIdParamsSchema } from "./students.schemas";
function fail(error: unknown, res: Response, next: NextFunction): void { if (error instanceof ZodError) { res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Request validation failed", details: error.issues } }); return; } if (error instanceof StudentsServiceError) { res.status(error.statusCode).json({ error: { code: error.code, message: error.message } }); return; } next(error); }
export async function listStudents(req: Request, res: Response, next: NextFunction) { try { res.status(200).json(await studentsService.list(listStudentsQuerySchema.parse(req.query))); } catch (e) { fail(e, res, next); } }
export async function getStudent(req: Request, res: Response, next: NextFunction) { try { const { id } = studentIdParamsSchema.parse(req.params); res.status(200).json({ data: await studentsService.getById(id) }); } catch (e) { fail(e, res, next); } }

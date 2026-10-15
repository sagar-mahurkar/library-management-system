import type { NextFunction, Request, Response } from "express";
import { summaryService } from "./summary.service";

export async function getSummary(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ data: await summaryService.getSummary() });
  } catch (error) {
    next(error);
  }
}

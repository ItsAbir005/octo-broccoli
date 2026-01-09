import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import AppError from "../error/AppError";

export const validate = (schema: ZodSchema) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const msg = result.error.issues.map(e => e.message).join(", ");
      throw new AppError(`Validation failed: ${msg}`, 400);
    }
    req.body = result.data;
    next();
  };
};

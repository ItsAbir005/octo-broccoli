import { Request, Response, NextFunction } from "express";
export const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const id = req.requestId ?? "no-id";

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[REQ-${id}] [${req.method}] ${req.url} — ${res.statusCode} — ${duration}ms`);
  });

  next();
};

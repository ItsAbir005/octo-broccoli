import { Request, Response, NextFunction } from "express";
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  const id = (req as any).requestId ?? "no-id";

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[REQ-${id}] [${req.method}] ${req.url} — ${res.statusCode} — ${duration}ms`
    );
  });

  next();
};
export const logger = {
  info: (msg: string) => {
    console.log(`[INFO] ${msg}`);
  },
  warn: (msg: string) => {
    console.warn(`[WARN] ${msg}`);
  },
  error: (msg: string) => {
    console.error(`[ERROR] ${msg}`);
  }
};

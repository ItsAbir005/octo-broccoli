import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}
export const requestId = (req: Request, _: Response, next: NextFunction) => {
  const id = crypto.randomUUID() || crypto.randomBytes(8).toString("hex");
  req["requestId"] = id;
  next();
};
export default requestId;
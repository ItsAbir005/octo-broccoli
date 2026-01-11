import jwt from "jsonwebtoken";
import { AppError } from "../error/AppError";

const ACCESS_SECRET = process.env.JWT_ACCESS!;

export const verifyWsToken = (token?: string) => {
  if (!token) throw new AppError("WebSocket token missing", 401);

  try {
    return jwt.verify(token, ACCESS_SECRET) as { id: string };
  } catch {
    throw new AppError("Invalid WebSocket token", 401);
  }
};

import jwt from "jsonwebtoken";
import AppError from "../error/AppError";

const REFRESH_SECRET = process.env.JWT_REFRESH!;
const ACCESS_SECRET = process.env.JWT_ACCESS!;
if (!REFRESH_SECRET || !ACCESS_SECRET) {
  throw new Error("JWT secrets are not configured. Please set JWT_REFRESH and JWT_ACCESS environment variables.");
}
export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as { id: string };
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }
};

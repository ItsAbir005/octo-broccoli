import { createClient } from "redis";
import AppError from "../error/AppError";

// Use localhost for local development, redis for Docker
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || "6379";
const redisUrl = process.env.REDIS_URL || `redis://${REDIS_HOST}:${REDIS_PORT}`;

const redis = createClient({
  url: redisUrl,
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.connect().catch((err) => {
  console.error("Redis connection failed:", err);
  process.exit(1);
});

export const saveRefreshToken = async (token: string, userId: string) => {
  await redis.set(`refresh:${token}`, userId, { EX: 7 * 24 * 60 * 60 });
};

export const isRefreshTokenValid = async (token: string) => {
  const user = await redis.get(`refresh:${token}`);
  return user !== null;
};

export const getUserIdFromRefresh = async (token: string) => {
  const userId = await redis.get(`refresh:${token}`);
  if (!userId) throw new AppError("Refresh token not found", 403);
  return userId;
};

export const deleteRefreshToken = async (token: string) => {
  await redis.del(`refresh:${token}`);
};

export default redis;
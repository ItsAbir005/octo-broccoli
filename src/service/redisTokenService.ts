import { createClient } from "redis";
import  AppError  from "../error/AppError";
const redis = createClient();
redis.connect().catch(() => {
  console.error("Redis connection failed");
  process.exit(1);
});
export const saveRefreshToken = async (token: string, userId: string) => {
  await redis.set(`refresh:${token}`, userId, { EX: 7 * 24 * 60 * 60 });
};
export const isRefreshTokenValid = async (token: string) => {
  const user = await redis.get(`refresh:${token}`);
  return user !== null;
};
export const deleteRefreshToken = async (token: string) => {
  await redis.del(`refresh:${token}`);
}
export default redis;
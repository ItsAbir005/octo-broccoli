import { Request, Response } from "express";
import redis from "../service/redisTokenService";

export const healthCheck = (_: Request, res: Response) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
  });
};

export const readinessCheck = async (_: Request, res: Response) => {
  try {
    await redis.ping();
    res.status(200).json({
      status: "READY",
      redis: "connected",
    });
  } catch {
    res.status(503).json({
      status: "NOT_READY",
      redis: "disconnected",
    });
  }
};

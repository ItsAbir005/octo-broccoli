import { Request, Response } from "express";
import { publishNotification } from "../queue/redisPublisher";

export const notifyUser = async (req: Request, res: Response) => {
  const { userId, message } = req.body;

  await publishNotification(userId, { message });

  res.json({ success: true });
};

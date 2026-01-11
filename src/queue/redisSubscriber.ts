import { createClient } from "redis";
import { clients } from "../ws/socketServer";
import { logger } from "../middleware/logger.middleware";

const subscriber = createClient({
  url: "redis://redis:6379",
});

subscriber.on("error", (err) => {
  logger.error(`Redis Subscriber Error: ${err}`);
});

async function startSubscriber() {
  await subscriber.connect();

  await subscriber.subscribe(
    "notifications",
    (message: string) => {
      const payload = JSON.parse(message);
      const ws = clients.get(payload.userId);

      if (ws) {
        ws.send(
          JSON.stringify({
            type: "NOTIFICATION",
            data: payload.data,
          })
        );
      }

      logger.info(`Notification consumed: ${JSON.stringify(payload)}`);
    }
  );
}

startSubscriber().catch((err) => {
  logger.error(`Failed to start Redis subscriber: ${err}`);
});

export default subscriber;

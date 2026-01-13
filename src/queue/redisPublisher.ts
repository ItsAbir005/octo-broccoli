import { createClient } from "redis";

const publisher = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
});

publisher.on("error", (err) => {
  console.error("Redis Publisher Error", err);
});

(async () => {
  await publisher.connect();
})();

export const publishNotification = async (
  userId: string,
  data: unknown
) => {
  await publisher.publish(
    "notifications",
    JSON.stringify({ userId, data })
  );
};
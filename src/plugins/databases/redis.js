import { createClient } from "redis";

const client = createClient({ url: process.env.REDIS_URL });

client.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
    const pong = await client.ping();
    console.log("PING response:", pong);
    await client.quit();
  } catch (err) {
    console.error("Failed to connect or ping Redis:", err);
  }
})();

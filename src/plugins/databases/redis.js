import fp from "fastify-plugin";
import { createClient } from "redis";

const client = createClient({ url: process.env.REDIS_URL });
await client.connect();
await client.set("key", "node redis");
const value = await client.get("key");
console.log(value);

async function redisPlugin(fastify, config) {
  const client = createClient({ url: process.env.REDIS_URL });

  client.on("error", (err) => fastify.log.error("Redis Client Error:", err));

  try {
    await client.connect(); // garante que a conexão ocorreu
    await client.ping(); // opcional, só pra ter certeza
    fastify.log.info("Connected to Redis");
  } catch (err) {
    fastify.log.error("Failed to connect to Redis:", err);
    throw err; // evita timeout no session-plugin
  }

  fastify.decorate("redis", client);

  fastify.addHook("onClose", async () => {
    await client.quit();
  });
}

export default fp(redisPlugin, { name: "redis-plugin" });

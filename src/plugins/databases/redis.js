import fp from "fastify-plugin";
import { createClient } from "redis";

async function redisPlugin(fastify, config) {
  const client = createClient({ url: config.url });

  client.on("error", (err) => fastify.log.error("Redis Client Error:", err));

  try {
    await client.connect(); // Se falhar, loga erro
    await client.ping();
    fastify.log.info("Connected to Redis");
  } catch (err) {
    fastify.log.error("Failed to connect to Redis:", err);
    fastify.decorate("redisStatus", "error"); // evita travar plugin
    return; // não lança erro, evita timeout
  }

  fastify.decorate("redis", client);
  fastify.decorate("redisStatus", "connected");

  fastify.addHook("onClose", async () => {
    await client.quit();
  });
}

export default fp(redisPlugin, { name: "redis-plugin" });

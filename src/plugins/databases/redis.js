import fp from "fastify-plugin";
import { createClient } from "redis";

async function redisPlugin(fastify, config) {
  const client = createClient({ url: config.url });

  client.on("error", (err) => {
    fastify.log.error("Redis Client Error", err);
  });

  await client.connect(); // ⬅️ espera até conectar de verdade
  fastify.log.info("Connected to Redis");

  fastify.decorate("redis", client);
  fastify.addHook("onClose", async (fastifyInstance) => {
    await client.quit();
  });
}

export default fp(redisPlugin, { name: "redis-plugin" });

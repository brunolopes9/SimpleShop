import fp from "fastify-plugin";
import { createClient } from "redis";

async function redisPlugin(fastify, config) {
  let redisStatus = "disconnected";

  const client = createClient({ url: config.url });

  client.on("error", (err) => {
    redisStatus = "error";
    fastify.log.error("Redis Client Error", err);
  });

  client.on("connect", () => {
    redisStatus = "connected";
    fastify.log.info("Connected to Redis");
  });

  // Aguarda até a conexão estar pronta
  await client.connect();

  fastify.decorate("redis", client);
  fastify.decorate("redisStatus", () => redisStatus);

  fastify.addHook("onClose", async (fastifyInstance, done) => {
    redisStatus = "disconnected";
    await fastify.redis.quit();
    done();
  });
}

export default fp(redisPlugin, { name: "redis-plugin" });

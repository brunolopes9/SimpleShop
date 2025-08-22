import fp from "fastify-plugin";
import { createClient } from "redis";

async function redisPlugin(fastify, config) {
  let redisStatus = "disconnected";

  try {
    const client = createClient({ url: config.url });

    client.on("ready", () => {
      redisStatus = "connected";
      fastify.log.info("Redis client ready");
    });

    client.on("error", (err) => {
      redisStatus = "error";
      fastify.log.error("Redis Client Error:", err);
    });

    await client.connect();

    fastify.decorate("redis", client);
    fastify.decorate("redisStatus", () => redisStatus);
  } catch (err) {
    fastify.log.error("Failed to connect to Redis:", err);
    throw err;
  }

  fastify.addHook("onClose", async (fastifyInstance, done) => {
    redisStatus = "disconnected";
    await fastify.redis.quit();
    done();
  });
}

export default fp(redisPlugin, { name: "redis-plugin" });

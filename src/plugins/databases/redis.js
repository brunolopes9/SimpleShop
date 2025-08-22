import fp from "fastify-plugin";
import Redis from "ioredis";

async function redisPlugin(fastify, config) {
  let redisStatus = "disconnected";

  try {
    const redis = new Redis(config.url);

    redis.on("connect", () => {
      redisStatus = "connected";
      fastify.log.info("Connected to Redis");
    });

    redis.on("error", (err) => {
      redisStatus = "error";
      fastify.log.error("Redis connection error:", err);
    });

    fastify.decorate("redis", redis);
  } catch (err) {
    fastify.log.error("Failed to connect to Redis:", err);
    throw err;
  }

  fastify.decorate("redisStatus", () => redisStatus);

  fastify.addHook("onClose", async (fastifyInstance, done) => {
    redisStatus = "disconnected";
    await fastify.redis.quit();
    done();
  });
}

export default fp(redisPlugin, { name: "redis-plugin" });

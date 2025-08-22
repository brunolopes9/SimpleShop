import fp from "fastify-plugin";
import { createClient } from "redis";

async function redisPlugin(fastify, config) {
  const client = createClient({
    url: config.url,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 5) return new Error("Unable to reconnect to Redis");
        return 2000;
      },
      connectTimeout: 5000,
      keepAlive: 10000
    }
  });

  client.on("error", (err) => fastify.log.error({ err }, "Redis Client Error"));

  try {
    await client.connect();
    // ⬅️ PING garante que a conexão está funcional antes de registrar
    await client.ping();
    fastify.log.info("Connected to Redis");
  } catch (err) {
    fastify.log.error({ err }, "Failed to connect to Redis");
    throw err; // evita timeout no session-plugin
  }

  fastify.decorate("redis", client);

  fastify.addHook("onClose", async () => {
    await client.quit();
  });
}

export default fp(redisPlugin, { name: "redis-plugin" });

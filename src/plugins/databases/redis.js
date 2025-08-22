import fp from "fastify-plugin";
import { createClient } from "redis";

async function redisPlugin(fastify, config) {
  const client = createClient({
    url: config.url,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 5) return new Error("Unable to reconnect to Redis");
        return 2000; // tenta reconectar a cada 2s, até 5 vezes
      }
    }
  });

  client.on("error", (err) => {
    fastify.log.error({ err }, "Redis Client Error");
  });

  try {
    await client.connect(); // espera conectar
    fastify.log.info("Connected to Redis");
  } catch (err) {
    fastify.log.error({ err }, "Failed to connect to Redis");
    throw err; // plugin falha, evita timeout infinito no session-plugin
  }

  fastify.decorate("redis", client);

  fastify.addHook("onClose", async () => {
    await client.quit();
  });
}

export default fp(redisPlugin, { name: "redis-plugin" });

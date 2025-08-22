import fp from "fastify-plugin";
import { createClient } from "redis";

async function redisPlugin(fastify, config) {
  const client = createClient({
    url: config.url,
    socket: {
      // evita reconexões infinitas agressivas
      reconnectStrategy: (retries) => {
        if (retries > 5) return new Error("Unable to reconnect to Redis");
        return 2000; // tenta reconectar a cada 2s
      },
      connectTimeout: 5000, // timeout de conexão
      keepAlive: 10000 // mantém o socket vivo
    }
  });

  client.on("error", (err) => {
    fastify.log.error({ err }, "Redis Client Error");
  });

  try {
    await client.connect();
    fastify.log.info("Connected to Redis");
  } catch (err) {
    fastify.log.error({ err }, "Failed to connect to Redis");
    throw err; // evita iniciar session-plugin se falhar
  }

  fastify.decorate("redis", client);

  fastify.addHook("onClose", async () => {
    await client.quit();
  });
}

export default fp(redisPlugin, { name: "redis-plugin" });

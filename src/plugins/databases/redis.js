import fp from "fastify-plugin";
import { createClient } from "redis";

async function redisPlugin(fastify, config) {
  // Detecta se precisa de TLS
  const useTLS = config.url.startsWith("rediss://");

  const client = createClient({
    url: config.url,
    socket: useTLS ? { tls: true, rejectUnauthorized: false } : undefined
  });

  client.on("error", (err) => {
    fastify.log.error({ err }, "Redis Client Error");
  });

  try {
    await client.connect(); // aguarda conexão
    fastify.log.info("Connected to Redis");
  } catch (err) {
    fastify.log.error({ err }, "Failed to connect to Redis");
    throw err; // se falhar, não prossegue com sessão
  }

  fastify.decorate("redis", client);

  fastify.addHook("onClose", async () => {
    await client.quit();
  });
}

export default fp(redisPlugin, { name: "redis-plugin" });

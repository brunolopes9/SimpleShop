import fp from "fastify-plugin";
import { createClient } from "redis";

async function redisPlugin(fastify, config) {
  const client = createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_URL,
      port: 18596,
      tls: true
    }
  });

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

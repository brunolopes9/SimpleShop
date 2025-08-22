import fp from "fastify-plugin";
import { createClient } from "redis";

async function redisPlugin(fastify, config) {
  const client = createClient({
    url: config.url // ex: redis://:<password>@<internal-host>:6379
  });

  client.on("error", (err) => fastify.log.error("Redis Client Error:", err));

  try {
    await client.connect(); // garante que a conexão ocorre
    await client.ping(); // verifica se tá funcionando
    fastify.log.info("Connected to Redis");
  } catch (err) {
    fastify.log.error("Failed to connect to Redis:", err);
    throw err; // impede que o plugin trave
  }

  fastify.decorate("redis", client);

  fastify.addHook("onClose", async () => {
    await client.quit();
  });
}

export default fp(redisPlugin, { name: "redis-plugin" });

import { createClient } from "redis";

export const config = {
  server: {
    port: process.env.PORT || 3000
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
    options: {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 3000
    }
  },
  mysql: {
    uri: process.env.MYSQL_URI,
    options: {
      logging: false
    }
  },
  redis: {
    url: process.env.REDIS_URL
  },
  session: {
    secret: "x3cIkEhWRLRLBD8Zfhd2SUw0UEGieSjOVV2a1a82YEE=" // ⚠️ ideal guardar isto também no .env
  }
};

// Inicializar Redis client
export async function initRedis() {
  const client = createClient({ url: config.redis.url });

  client.on("error", (err) => console.error("Redis Client Error", err));

  await client.connect();
  console.log("✅ Redis connected!");

  return client;
}

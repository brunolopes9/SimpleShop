import Fastify from "fastify";
import { config } from "./config/index.js";

import mongoosePlugin from "./plugins/databases/mongoose.js";
import sequelizePlugin from "./plugins/databases/sequelize.js";
import redisPlugin from "./plugins/databases/redis.js";
import staticPlugin from "./plugins/static.js";
import viewPlugin from "./plugins/views.js";
import routesPlugin from "./plugins/routes.js";
import defaultsPlugin from "./plugins/defaults.js";
import sessionPlugin from "./plugins/session.js";
import formBody from "@fastify/formbody";
import basketPlugin from "./plugins/basket.js";

const fastify = Fastify({ logger: true, disableRequestLogging: true });

const start = async () => {
  try {
    // Plugins independentes
    await fastify.register(formBody);
    await fastify.register(staticPlugin);
    await fastify.register(defaultsPlugin);
    await fastify.register(mongoosePlugin, config.mongodb);
    await fastify.register(sequelizePlugin, config.mysql);

    // Redis primeiro, sessão depois
    await fastify.register(redisPlugin, config.redis);
    await fastify.register(sessionPlugin, {
      ...config.session,
      // opcional: aumenta timeout para garantir que não falhe em slow connections
      timeout: 60000
    });

    // Outros plugins
    await fastify.register(basketPlugin);
    await fastify.register(viewPlugin);
    await fastify.register(routesPlugin);

    const port = config.server.port;
    await fastify.listen({ port });
    fastify.log.info(`Server running at http://localhost:${port}/`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

import fp from "fastify-plugin";
import { Sequelize } from "sequelize";
import { readdir } from "fs/promises";
import path from "path";

async function sequelizePlugin(fastify, config) {
  let mysqlStatus = "disconnected";

  // TODO: Connect to MySQL via Sequelize and update the status
  try {
    const sequelize = new Sequelize(config.uri, config.options);
    await sequelize.authenticate();
    fastify.log.info("Conected to MySQL");
    mysqlStatus = "connected";
    fastify.decorate("sequelize", sequelize);

    // Deal With Models
    const models = {};
    const modelsPath = path.resolve("src/models/sequelize");
    const modelFiles = await readdir(modelsPath);
  } catch (err) {
    fastify.log.error("Failed to connect to MySQL:", err);
    mysqlStatus = "error";
  }

  fastify.decorate("mysqlStatus", () => mysqlStatus);

  // Graceful shutdown
  fastify.addHook("onClose", async (fastifyInstance, done) => {
    mysqlStatus = "disconnected";
    await sequelize.close();
    // TODO: Close Sequelize connection
    done();
  });
}

export default fp(sequelizePlugin, { name: "sequelize-plugin" });

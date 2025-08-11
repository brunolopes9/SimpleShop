import fp from "fastify-plugin";
import { Sequelize } from "sequelize";
import { readdir } from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";

async function sequelizePlugin(fastify, config) {
  let mysqlStatus = "disconnected";

  try {
    const sequelize = new Sequelize(config.uri, config.options);
    await sequelize.authenticate();
    fastify.log.info("Connected to MySQL");
    mysqlStatus = "connected";
    fastify.decorate("sequelize", sequelize);

    const models = {};
    const modelsPath = path.resolve("src/models/sequelize");
    const modelFiles = await readdir(modelsPath);

    for (const file of modelFiles) {
      if (file.endsWith(".js")) {
        const fullPath = path.join(modelsPath, file);
        const modelModule = await import(pathToFileURL(fullPath).href);
        const model = modelModule.default(sequelize, Sequelize.DataTypes);
        models[model.name] = model;
        fastify.log.info(`Sequelize model ${model.name} loaded`);
      }
    }

    Object.values(models).forEach((model) => {
      if (model.associate) {
        model.associate(models);
      }
    });

    await sequelize.sync({ alter: false });
    fastify.log.info("Sequelize models synced successfully");
    fastify.decorate("models", models);
  } catch (err) {
    fastify.log.error("Failed to connect to MySQL:", err);
    throw err;
  }

  fastify.decorate("mysqlStatus", () => mysqlStatus);

  fastify.addHook("onClose", async (fastifyInstance, done) => {
    mysqlStatus = "disconnected";
    await sequelize.close();
    done();
  });
}

export default fp(sequelizePlugin, { name: "sequelize-plugin" });

import fp from "fastify-plugin";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";

async function sessionPlugin(fastify, config) {
  const secret = config.secret;

  if (!secret) {
    throw new Error(
      "SESSION_SECRET environment variable is required for secure sessions."
    );
  }

  // Regista fastify-cookie
  await fastify.register(fastifyCookie);

  // Cria e conecta o cliente Redis oficial
  const redisClient = createClient({
    socket: {
      host: config.host,
      port: config.port
    }
  });

  redisClient.on("error", (err) =>
    fastify.log.error("Redis Client Error", err)
  );

  await redisClient.connect();

  // Cria o RedisStore com o cliente redis oficial
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: "myshop:"
  });

  // Regista fastify-session com RedisStore
  await fastify.register(fastifySession, {
    store: redisStore,
    secret,
    cookie: {
      path: "/",
      httpOnly: true,
      secure: false,
      maxAge: 3600 * 1000
    }
  });

  // Decorate para limpar sessão
  fastify.decorate("clearSession", (req) => {
    req.session.set("user", null);
  });

  // PreHandler: Attach session messages to locals
  fastify.addHook("preHandler", async (req, reply) => {
    reply.locals = {
      ...(reply.locals || {}),
      currentUser: req.session.get("user") || null,
      messages: req.session.get("messages") || []
    };
  });

  // Decorate reply.view para limpar mensagens após renderizar
  fastify.addHook("onRequest", async (req, reply) => {
    const originalView = reply.view;
    reply.view = function (template, data) {
      const result = originalView.call(this, template, data);
      req.session.set("messages", []);
      return result;
    };
  });

  // Fechar conexão Redis no encerramento do Fastify
  fastify.addHook("onClose", async (instance, done) => {
    await redisClient.quit();
    done();
  });
}

export default fp(sessionPlugin, { name: "session-plugin" });

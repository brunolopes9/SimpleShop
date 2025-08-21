export default async function userRoutes(fastify) {
  // --- LOGIN / LOGOUT ---
  fastify.get("/login", async (req, reply) => {
    if (req.session.get("user")) return reply.redirect("/");
    return reply.view("login", {
      currentPath: "/user/login",
      messages: req.session.get("messages") || []
    });
  });

  fastify.post("/login", async (req, reply) => {
    const { email, password } = req.body;
    const user = await fastify.models.User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      req.session.set("messages", [
        { type: "danger", text: "Invalid email or password." }
      ]);
      return reply.redirect("/user/login");
    }
    req.session.set("user", { id: user.id, email: user.email });
    return reply.redirect("/");
  });

  fastify.get("/logout", async (req, reply) => {
    fastify.clearSession(req);
    return reply.redirect("/user/login");
  });

  // --- DELETE USERS ---
  fastify.delete("/user", async (request, reply) => {
    const { userIds } = request.body;
    if (!Array.isArray(userIds))
      return reply.status(400).send({ error: "userIds precisa ser um array" });

    try {
      await fastify.models.User.destroy({ where: { id: userIds } });
      return {
        message: `Usuários ${userIds.join(", ")} deletados com sucesso!`
      };
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: "Erro ao deletar usuários" });
    }
  });
}

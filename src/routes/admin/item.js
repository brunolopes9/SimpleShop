export default async function (fastify) {
  // Route to display and manage items
  fastify.get("/", async (request, reply) => {
    // Fetch all items from the database

    const items = await fastify.Item.find({});

    return reply.view("admin/item.ejs", {
      title: "Manage Items",
      currentPath: "/admin/item",
      items
    });
  });

  // Route to create or edit an item
  fastify.post("/", async (request, reply) => {
    const { itemId, sku, name, price, tags } = request.body;

    const parsedTags = tags ? tags.split(",").map((tag) => tag.trim()) : [];

    // Placeholder logic to create or update an item
    try {
      if (itemId) {
        await fastify.Item.findByIdAndUpdate(itemId, {
          sku,
          name,
          price,
          tags: parsedTags
        });

        fastify.log.info(`Updating item ${itemId}:`, {
          sku,
          name,
          price
        });
      } else {
        await fastify.Item.create({ sku, name, price, tags: parsedTags });
        fastify.log.info(`Created new item: ${name}`);
      }
      request.session.set("messages", [
        {
          type: "success",
          text: itemId
            ? "Item updated successfully"
            : "Item created Successfully"
        }
      ]);
      return reply.redirect("/admin/item");
    } catch (err) {
      request.session.set("messages", [
        { type: "danger", text: "failed to save item" }
      ]);
      fastify.log.error("Error saving item:");
      return reply.redirect("/admin/item");
    }
  });

  // Route to delete an item
  fastify.get("/delete/:id", async (request, reply) => {
    const { id } = request.params;

    try {
      await fastify.Item.findByIdAndDelete(id);
      request.session.set("messages", [
        { type: "success", text: "Successfully Deleted Item" }
      ]);
      fastify.log.info(`Deleted item with id: ${id}`);
    } catch (err) {
      request.session.set("messages", [
        { type: "danger", text: "Failed to delete item" }
      ]);
      fastify.log.error("Error deleting item:", err);
    }

    return reply.redirect("/admin/item");
  });

  // Route to fetch a single item for editing
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params;

    const item = await fastify.Item.findById(id);

    return reply.view("admin/item.ejs", {
      title: "Edit Item",
      currentPath: "/admin/item",
      items: [], // Pass empty items array for simplicity
      item
    });
  });
}

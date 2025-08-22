export const config = {
  server: {
    port: process.env.PORT || 3000
  },

  mongodb: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 3000
    }
  },

  mysql: {
    uri: process.env.MYSQL_URI,
    options: {
      logging: false,
      dialectOptions: {
        ssl: false // SSL desativado
      }
    }
  },

  redis: {
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: "redis-18596.c8.us-east-1-3.ec2.redns.redis-cloud.com",
      port: 18596
    }
  },

  session: {
    secret: process.env.SESSION_SECRET || "chave_fallback"
  }
};

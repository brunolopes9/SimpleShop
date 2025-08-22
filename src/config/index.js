import dotenv from "dotenv";
dotenv.config();

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

  redis: { url: process.env.REDIS_URL },

  session: {
    // Secret key to encrypt client side sessions.
    // Created on the terminal with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
    secret: process.env.SESSION_SECRET
  }
};

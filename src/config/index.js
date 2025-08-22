import fs from "fs";
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
      loggin: false,
      dialectOptions: {
        ssl: {
          ca: fs.readFileSync("src/config/ca.pem")
        }
      }
    }
  },

  redis: {
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: "redis-18596.c8.us-east-1-3.ec2.redns.redis-cloud.com",
      port: 18596,
      tls: true
    }
  },
  session: {
    // Secret key to encrypt client side sessions.
    // Created on the terminal with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
    secret: "x3cIkEhWRLRLBD8Zfhd2SUw0UEGieSjOVV2a1a82YEE="
  }
};

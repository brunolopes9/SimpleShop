import fs from "fs";

export const config = {
  server: {
    port: process.env.PORT || 3000
  },
  mongodb: {
    uri: "mongodb+srv://bruno:1234@cluster0.zg8q01r.mongodb.net/nomeDoBanco?retryWrites=true&w=majority",
    options: {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 3000
    }
  },

  mysql: {
    uri: "mysql://avnadmin:AVNS_FvH32m4kp5P6PPPWhjy@mysql-2a944e79-bruno-ae2d.f.aivencloud.com:24220/defaultdb?ssl-mode=REQUIRED",
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
    password: "HvhJ4A72LqfABcN7yC1duwdl6nDNaIHY",
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

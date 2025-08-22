import fs from "fs";

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
      loggin: false
    }
  },

  redis: {
    socket: {
      host: "red-d2k772fdiees73dchkb0",
      port: 6379
    }
  },
  session: {
    // Secret key to encrypt client side sessions.
    // Created on the terminal with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
    secret: "x3cIkEhWRLRLBD8Zfhd2SUw0UEGieSjOVV2a1a82YEE="
  }
};

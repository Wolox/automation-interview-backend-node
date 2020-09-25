const ENVIRONMENT = process.env.NODE_ENV || 'development';

if (ENVIRONMENT !== 'production') {
  require('dotenv').config();
}

const configFile = `./${ENVIRONMENT}`;

const isObject = variable => variable instanceof Object;

/*
 * Deep copy of source object into tarjet object.
 * It does not overwrite properties.
 */
const assignObject = (target, source) => {
  if (target && isObject(target) && source && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(target, key) || target[key] === undefined) {
        target[key] = source[key];
      } else {
        assignObject(target[key], source[key]);
      }
    });
  }
  return target;
};

const config = {
  common: {
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    },
    api: {
      bodySizeLimit: process.env.API_BODY_SIZE_LIMIT,
      parameterLimit: process.env.API_PARAMETER_LIMIT,
      port: process.env.PORT,
      host: `${process.env.HOST}:${process.env.PORT}`
    },
    externalApi: {
      albumsEndpoint: process.env.EXTERNAL_API_ALBUMS || 'https://jsonplaceholder.typicode.com/albums',
      photosEndpoint: process.env.EXTERNAL_API_PHOTOS
    },
    token: {
      secret: process.env.TOKEN_SECRET || 'supersecret'
    },
    session: {
      header_name: 'authorization',
      secret: process.env.NODE_API_SESSION_SECRET || 'supersecret',
      expirationTime: process.env.TOKEN_EXPIRATION_TIME || 1800000
    },
    email: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      senderAddress: process.env.EMAIL_SENDER_ADDRESS,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    }
  }
};

const customConfig = require(configFile).config;
module.exports = assignObject(customConfig, config);

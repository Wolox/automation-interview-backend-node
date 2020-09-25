exports.config = {
  environment: 'development',
  common: {
    api: {
      host: 'http://localhost:8081'
    },
    database: {
      name: process.env.DB_NAME_DEV
    }
  },
  email: {
    host: process.env.DEV_EMAIL_HOST,
    port: process.env.DEV_EMAIL_PORT,
    senderAddress: process.env.DEV_EMAIL_SENDER_ADDRESS,
    auth: {
      user: process.env.DEV_EMAIL_USER,
      pass: process.env.DEV_EMAIL_PASS
    }
  },
  isDevelopment: true
};

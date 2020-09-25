exports.config = {
  environment: 'production',
  common: {
    api: {
      host: `${process.env.HOST}`
    },
    database: {
      name: process.env.DB_NAME
    }
  },
  isProduction: true
};

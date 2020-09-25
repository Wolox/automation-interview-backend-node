exports.config = {
  environment: 'testing',
  isTesting: true,
  common: {
    database: {
      name: process.env.DB_NAME_TEST
    },
    api: {
      host: `${process.env.HOST}:${process.env.PORT}`
    },
    externalApi: {
      albumsEndpoint: 'https://fake.com/albums',
      photosEndpoint: 'https://fake.com/photos'
    },
    token: {
      secret: 'some-super-secret'
    },
    session: {
      secret: 'some-super-secret',
      expirationTime: 3000
    }
  }
};

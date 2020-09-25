const nock = require('nock');
const { albumsEndpoint } = require('../../config').common.externalApi;

exports.getAlbum = albumId =>
  nock(albumsEndpoint)
    .get(`/${albumId}`)
    .reply(200, {
      userId: 1,
      id: albumId,
      title: 'quidem molestiae enim'
    });

exports.notFoundAlbum = albumId =>
  nock(albumsEndpoint)
    .get(`/${albumId}`)
    .reply(404);

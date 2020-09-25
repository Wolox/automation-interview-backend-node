const axios = require('axios');
const { albumsEndpoint, photosEndpoint } = require('../../config').common.externalApi;
const { externalApiError, notFoundError } = require('../errors');

const formatData = response => response.data;

const processExternalRequest = request =>
  request.then(formatData).catch(error => {
    if (error.response && error.response.status === 404) {
      throw notFoundError(error.message);
    }
    throw externalApiError(error.message);
  });

exports.getAllAlbums = () => processExternalRequest(axios.get(albumsEndpoint));

exports.getAlbumById = albumId => processExternalRequest(axios.get(`${albumsEndpoint}/${albumId}`));

exports.getPhotosByAlbum = albumId =>
  processExternalRequest(axios.get(`${photosEndpoint}/?albumId=${albumId}`));

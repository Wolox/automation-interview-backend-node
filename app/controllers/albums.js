const { getAllAlbums, getAlbumById, getPhotosByAlbum } = require('../services/externalServices');
const { createUserAlbum, getUserAlbums, getUserAlbum } = require('../services/albums');
const { extractField } = require('../serializers/fieldExtractor');
const { notFoundError } = require('../errors');

exports.getAlbums = (req, res, next) => {
  const { userId } = req.params;
  if (userId) {
    return getUserAlbums(userId)
      .then(extractField('dataValues'))
      .then(response =>
        Promise.all(
          response.map(purchasedData =>
            getAlbumById(parseInt(purchasedData.albumId)).then(album => ({
              album,
              user_id: purchasedData.userId,
              created_at: purchasedData.created_at
            }))
          )
        )
      )
      .then(response => res.send(response))
      .catch(next);
  }

  const albumId = req.params.id;
  const selectGetFn = albumId ? getAlbumById : getAllAlbums;
  return selectGetFn(albumId)
    .then(response => res.send(response))
    .catch(next);
};

exports.getPhotos = (req, res, next) => {
  const albumId = req.params.id;
  return getPhotosByAlbum(albumId)
    .then(response => res.send(response))
    .catch(next);
};

exports.buyAlbum = (req, res, next) => {
  const { userId } = req.locals;
  const { id } = req.params;
  return getAlbumById(parseInt(id))
    .then(createUserAlbum(userId))
    .then(() => res.status(201).end())
    .catch(next);
};

exports.getUserAlbumPhotos = (req, res, next) => {
  const { userId } = req.locals;
  const albumId = parseInt(req.params.albumId);

  return getUserAlbum(userId, albumId)
    .then(extractField('dataValues'))
    .then(album => {
      if (!album) {
        return next(notFoundError('The album you are looking for does not exist or does not belong to you'));
      }
      return getPhotosByAlbum(albumId);
    })
    .then(response => res.send(response))
    .catch(next);
};

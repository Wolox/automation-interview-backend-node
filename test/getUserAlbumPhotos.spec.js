const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);
const { getAlbumsPhotos } = require('./mocks/mockPhotos');
const { runFactory, authorizationFactory } = require('./helpers');
const { AUTHENTICATION_ERROR, NOT_FOUND_ERROR } = require('../app/errors');
const { ADMIN_ROLE, REGULAR_ROLE } = require('../app/helpers/constants');
const createAlbums = runFactory('album');
const createUser = runFactory('user');

const createAssets = () => createUser(2).then(() => createAlbums(1));
const getAlbums = ({ userId, albumId, role }) => {
  const authorization = userId ? authorizationFactory[role](userId) : {};
  getAlbumsPhotos(albumId);
  return request.get(`/users/albums/${albumId}/photos`).set(authorization);
};
describe('GET /users/albums/:albumId/photos', () => {
  it('should success when user is authenticated and album owner', () =>
    createAssets()
      .then(([{ userId, albumId }]) => getAlbums({ userId, albumId, role: ADMIN_ROLE }))
      .then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.body.length).to.equal(4);
      }));

  it('should fail because user is not autenticated', () =>
    createAssets()
      .then(([{ albumId }]) => getAlbums({ albumId, role: REGULAR_ROLE }))
      .then(response => {
        expect(response.statusCode).to.equal(401);
        expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
      }));

  it('should fail because user is not album owner (regular user)', () =>
    createAssets()
      .then(([{ albumId }]) => getAlbums({ albumId, userId: 2, role: REGULAR_ROLE }))
      .then(response => {
        expect(response.statusCode).to.equal(404);
        expect(response.body.internal_code).to.equal(NOT_FOUND_ERROR);
      }));

  it('should fail because user is not album owner (admin user)', () =>
    createAssets()
      .then(([{ albumId }]) => getAlbums({ albumId, userId: 2, role: ADMIN_ROLE }))
      .then(response => {
        expect(response.statusCode).to.equal(404);
        expect(response.body.internal_code).to.equal(NOT_FOUND_ERROR);
      }));

  it('should fail because album does not exist', () =>
    createAssets()
      .then(([{ userId, albumId }]) => getAlbums({ userId, albumId: albumId + 1, role: ADMIN_ROLE }))
      .then(response => {
        expect(response.statusCode).to.equal(404);
        expect(response.body.internal_code).to.equal(NOT_FOUND_ERROR);
      }));
});

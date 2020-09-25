const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const request = supertest(app);
const { AUTHENTICATION_ERROR, FORBIDDEN_ERROR } = require('../app/errors');
const { authorizationFactory, runFactory } = require('./helpers');
const { REGULAR_ROLE, ADMIN_ROLE } = require('../app/helpers/constants');

const createUsers = runFactory('user');
const createAlbums = runFactory('album');

const checkSuccessfulResponse = response => {
  expect(response.statusCode).to.equal(200);
  expect(response.body.length).to.equal(5);
  response.body.forEach(item => {
    expect(item).to.have.property('userId');
    expect(item).to.have.property('albumId');
    expect(item).to.have.property('uri');
  });
};

const createAssets = () => Promise.all([createUsers(2), createAlbums(5)]);
const getAlbums = (type, id) => () => {
  const auth = id && type ? authorizationFactory[type](id) : {};
  return request.get('/users/1/albums').set(auth);
};

describe('GET /users/:userId/albums', () => {
  it('should succeed when user is authenticated and requested user exists', () =>
    createAssets()
      .then(getAlbums(REGULAR_ROLE, 1))
      .then(checkSuccessfulResponse));

  it('should fail because user is not authenticated', () =>
    createAssets()
      .then(getAlbums())
      .then(response => {
        expect(response.statusCode).to.equal(401);
        expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
      }));

  it('should fail because user does not have permission when user requested is different from user logged', () =>
    createAssets()
      .then(getAlbums(REGULAR_ROLE, 2))
      .then(response => {
        expect(response.statusCode).to.equal(403);
        expect(response.body.internal_code).to.equal(FORBIDDEN_ERROR);
      }));

  it('should succeed because user is admin when user requested is different from user logged', () =>
    createAssets()
      .then(getAlbums(ADMIN_ROLE, 2))
      .then(checkSuccessfulResponse));
});

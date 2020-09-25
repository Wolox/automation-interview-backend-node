const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const request = supertest(app);
const { authorizationFactory } = require('./helpers');
const { runFactory } = require('./helpers');
const { host } = require('../config').common.api;
const { AUTHENTICATION_ERROR, NOT_FOUND_ERROR } = require('../app/errors');

const createUsers = runFactory('user');
const expected = {
  count: 25,
  status: 200,
  resultLength: 10,
  prev: null,
  next: null
};

const getNextRequest = page => request.get(`/users?page=${page}`).set(authorizationFactory.regular(1));

const checkResponse = (response, expectedValues) => {
  expect(response.statusCode).to.equal(expectedValues.status);
  expect(response.body.count).to.equal(expectedValues.count);
  expect(response.body.result.length).to.equal(expectedValues.resultLength);
  expect(response.body.prev).to.equal(expectedValues.prev);
  expect(response.body.next).to.equal(expectedValues.next);
};

describe('GET /users', () => {
  it('should success when user is logged in', () =>
    createUsers(25)
      .then(() => request.get('/users').set(authorizationFactory.regular(1)))
      .then(response => {
        checkResponse(response, { ...expected, next: `${host}/users?page=2` });
        return getNextRequest(2);
      })
      .then(response => {
        checkResponse(response, {
          ...expected,
          next: `${host}/users?page=3`,
          prev: `${host}/users?page=1`
        });
        return getNextRequest(3);
      })
      .then(response => {
        checkResponse(response, {
          ...expected,
          resultLength: 5,
          prev: `${host}/users?page=2`
        });
      }));

  it('should fail because user is not authenticated', () =>
    request
      .get('/users')
      .set(authorizationFactory.invalid)
      .then(response => {
        expect(response.statusCode).to.equal(401);
        expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
      }));
});

describe('GET /users/:id', () => {
  it('should success when user is logged in', () =>
    createUsers(2)
      .then(result => request.get(`/users/${result[1].id}`).set(authorizationFactory.regular(result[0].id)))
      .then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.property('firstName');
        expect(response.body).to.have.property('lastName');
        expect(response.body).to.have.property('email');
      }));

  it('should fail because user is not authenticated', () =>
    request
      .get('/users/mail2@wolox.com.ar')
      .set(authorizationFactory.invalid)
      .then(response => {
        expect(response.statusCode).to.equal(401);
        expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
      }));

  it('should fail because user requested does not exist', () =>
    createUsers(1)
      .then(result => request.get('/users/9999').set(authorizationFactory.regular(result[0].id)))
      .then(response => {
        expect(response.statusCode).to.equal(404);
        expect(response.body.internal_code).to.equal(NOT_FOUND_ERROR);
      }));
});

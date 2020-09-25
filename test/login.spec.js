const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const {
  invalidPasswordLengthMessage,
  invalidPasswordMessage,
  invalidEmailDomainMessage,
  missingRequiredFieldsMessage,
  authenticationErrorMessage
} = require('../app/helpers');
const {
  mockUser,
  loggingUser,
  wrongDomainUser,
  passwordTooShortUser,
  wrongFormatPasswordUser,
  unexistentUserNameUser,
  missingPasswordUser,
  missignEmailUser,
  wrongPasswordUser
} = require('./mocks/mockLoggingUser');
const { VALIDATION_ERROR, AUTHENTICATION_ERROR, MISSING_DATA_ERROR } = require('../app/errors');
const request = supertest(app);
const { runFactory, authorizationFactory } = require('./helpers');
const { waitForAWhile } = require('./helpers/utils');
const createUsers = runFactory('user');
const createMockUser = user => request.post('/users').send(user);

const login = user => () => request.post('/users/sessions').send(user);

describe('POST /users/sessions', () => {
  it('should success when data passes validation checks', () =>
    createMockUser(mockUser)
      .then(login(loggingUser))
      .then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.headers).to.have.property('authorization');
      }));

  it('should fail because email is not @wolox.com.ar', () =>
    createMockUser(mockUser)
      .then(login(wrongDomainUser))
      .then(response => {
        expect(response.statusCode).to.equal(422);
        expect(response.body.message).to.include(invalidEmailDomainMessage);
        expect(response.body.internal_code).to.equal(VALIDATION_ERROR);
      }));

  it('should fail because password id too short', () =>
    createMockUser(mockUser)
      .then(login(passwordTooShortUser))
      .then(response => {
        expect(response.statusCode).to.equal(422);
        expect(response.body.message).to.include(invalidPasswordLengthMessage);
        expect(response.body.internal_code).to.equal(VALIDATION_ERROR);
      }));

  it('should fail because password is badly formatted', () =>
    createMockUser(mockUser)
      .then(login(wrongFormatPasswordUser))
      .then(response => {
        expect(response.statusCode).to.equal(422);
        expect(response.body.message).to.include(invalidPasswordMessage);
        expect(response.body.internal_code).to.equal(VALIDATION_ERROR);
      }));

  it('should fail because email does not exist', () =>
    createMockUser(mockUser)
      .then(login(unexistentUserNameUser))
      .then(response => {
        expect(response.statusCode).to.equal(401);
        expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
      }));

  it('should fail because password is missing', () =>
    createMockUser(mockUser)
      .then(login(missingPasswordUser))
      .then(response => {
        expect(response.statusCode).to.equal(400);
        expect(response.body.message).to.include(missingRequiredFieldsMessage);
        expect(response.body.message).to.include('password');
        expect(response.body.internal_code).to.equal(MISSING_DATA_ERROR);
      }));

  it('should fail because email is missing', () =>
    createMockUser(mockUser)
      .then(login(missignEmailUser))
      .then(response => {
        expect(response.statusCode).to.equal(400);
        expect(response.body.message).to.include(missingRequiredFieldsMessage);
        expect(response.body.message).to.include('email');
        expect(response.body.internal_code).to.include(MISSING_DATA_ERROR);
      }));

  it('should fail because password recieved does not match password saved', () =>
    createMockUser(mockUser)
      .then(login(wrongPasswordUser))
      .then(response => {
        expect(response.statusCode).to.equal(401);
        expect(response.body.message).to.include(authenticationErrorMessage);
        expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
      }));

  it('should respond with expiration time', () =>
    createUsers(1)
      .then(([{ email }]) => request.post('/users/sessions').send({ email, password: '1234567ocho' }))
      .then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.property('tokenExpiresAt');
      }));

  it('should fail because token has expire', () =>
    createUsers(1)
      .then(([{ id }]) => authorizationFactory.regular(id))
      .then(authorization => waitForAWhile(4000, () => authorization))
      .then(authorization => request.get('/users').set(authorization))
      .then(response => {
        expect(response.statusCode).to.equal(401);
        expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
      }));
});

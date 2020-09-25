const moment = require('moment');
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);
const { runFactory, authorizationFactory } = require('./helpers');
const { waitForAWhile } = require('./helpers/utils');
const createUsers = runFactory('user');
const { AUTHENTICATION_ERROR } = require('../app/errors');
const { User } = require('../app/models');
const { invalidateUserSessions } = require('../app/services/usersService');

describe('POST /users/sessions/invalidate_all', () => {
  it('should succeed when user is authenticated', () =>
    createUsers(1)
      .then(([{ id }]) =>
        Promise.all([
          request.post('/users/sessions/invalidate_all').set(authorizationFactory.regular(id)),
          id
        ])
      )
      .then(([response, id]) => {
        expect(response.statusCode).to.equal(204);
        return User.findBy({ id });
      })
      .then(response => {
        const invalidationDate = moment(response.sessionInvalid).format('YYYY-MM-DD');
        const today = moment().format('YYYY-MM-DD');
        expect(moment(invalidationDate).isSame(today)).to.equal(true);
      }));

  it('should fail because user is not authenticated', () =>
    createUsers(1)
      .then(() => request.post('/users/sessions/invalidate_all').set(authorizationFactory.invalid))
      .then(response => {
        expect(response.statusCode).to.equal(401);
        expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
      }));

  it('GET /users should fail because sessions have been invalidated', () => {
    const createAuthorization = ([{ id }]) => [authorizationFactory.regular(id), id];
    const waitAndInvalidateSessions = ([authorization, id]) =>
      waitForAWhile(4000, () => invalidateUserSessions(id).then(() => authorization));

    const getUsers = authorization => request.get('/users').set(authorization);

    return createUsers(1)
      .then(createAuthorization)
      .then(waitAndInvalidateSessions)
      .then(getUsers)
      .then(response => {
        expect(response.statusCode).to.equal(401);
        expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
      });
  });
});

const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const request = supertest(app);
const { User } = require('../app/models');
const { mockUser } = require('./mocks/mockUsers');
const { FORBIDDEN_ERROR } = require('../app/errors');
const { ADMIN_ROLE, REGULAR_ROLE } = require('../app/helpers');
const { authorizationFactory, runFactory } = require('./helpers');
const createUsers = runFactory('user');
const createUserAndLogin = type =>
  createUsers(1).then(result =>
    request
      .post('/admin/users')
      .send(mockUser)
      .set(authorizationFactory[type](result[0].id))
  );

describe('POST /admin/users', () => {
  it('should succeed when user has authorization (create new admin)', () => {
    const findUser = response => {
      expect(response.statusCode).to.equal(201);
      return User.find({ where: { email: mockUser.email } });
    };

    return createUserAndLogin(ADMIN_ROLE)
      .then(findUser)
      .then(response => {
        expect(response.firstName).to.equal(mockUser.firstName);
        expect(response.lastName).to.equal(mockUser.lastName);
        expect(response.email).to.equal(mockUser.email);
        expect(response.role).to.equal(ADMIN_ROLE);
      });
  });

  it('should succeed when user has authorization (update existing user)', () => {
    const sendAdminUser = ([user, userToUpdate]) =>
      Promise.all([
        request
          .post('/admin/users')
          .send({ ...mockUser, email: userToUpdate.email })
          .set(authorizationFactory.admin(user.id)),
        userToUpdate
      ]);
    const findUser = ([response, userToUpdate]) => {
      expect(response.statusCode).to.equal(200);
      return User.find({ where: { email: userToUpdate.email } });
    };

    return createUsers(2)
      .then(sendAdminUser)
      .then(findUser)
      .then(response => {
        expect(response.role).to.equal(ADMIN_ROLE);
      });
  });

  it('should fail because user is not authorized', () =>
    createUserAndLogin(REGULAR_ROLE).then(response => {
      expect(response.statusCode).to.equal(403);
      expect(response.body.internal_code).to.equal(FORBIDDEN_ERROR);
    }));
});

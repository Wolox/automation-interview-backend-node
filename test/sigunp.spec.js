const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../app');
const { User } = require('../app/models');
const {
  alreadyExistsErrorMessage,
  invalidPasswordLengthMessage,
  invalidPasswordMessage,
  invalidEmailDomainMessage,
  missingRequiredFieldsMessage,
  EMAIL_DOMAIN
} = require('../app/helpers');
const {
  mockUser,
  passwordTooShortUser,
  wrongFormatPasswordUser,
  wrongDomainUser,
  passwordMissingUser,
  emailMissingUser,
  emptyUser,
  firstNameMissingUser,
  lastNameMissingUser
} = require('./mocks/mockUsers');
const { ENTITY_ALREADY_EXISTS, MISSING_DATA_ERROR, VALIDATION_ERROR } = require('../app/errors');
const request = supertest(app);
const createUser = user => request.post('/users').send(user);
const emails = require('../app/services/emails');
emails.sendWelcomeEmail = jest.fn();

describe('POST /users', () => {
  beforeEach(() => {
    emails.sendWelcomeEmail.mockResolvedValue('SEND EMAIL');
    emails.sendWelcomeEmail.mockClear();
  });
  it('should success when data passes validation checks', () =>
    createUser(mockUser)
      .then(res => {
        expect(res.statusCode).toBe(201);
        return User.findOne({ where: { email: mockUser.email } });
      })
      .then(user => {
        const arePasswordsEqual = bcrypt.compare(mockUser.password, user.password);
        return Promise.all([user, arePasswordsEqual]);
      })
      .then(([user, arePasswordsEqual]) => {
        expect(arePasswordsEqual).toBe(true);
        expect(user.firstName).toBe(mockUser.firstName);
        expect(user.lastName).toBe(mockUser.lastName);
        expect(user.email).toBe(mockUser.email);
      }));

  it('should fail because email already exists', () =>
    createUser(mockUser)
      .then(() => request.post('/users').send(mockUser))
      .then(response => {
        expect(response.body.message).toContain(alreadyExistsErrorMessage);
        expect(response.body.internal_code).toBe(ENTITY_ALREADY_EXISTS);
        expect(response.statusCode).toBe(422);
      }));

  it('should fail because password is badly formatted (too short)', () =>
    createUser(passwordTooShortUser).then(response => {
      expect(response.body.message).toContain(invalidPasswordLengthMessage);
      expect(response.body.internal_code).toBe(VALIDATION_ERROR);
      expect(response.statusCode).toBe(422);
    }));

  it('should fail because password is badly formatted (not containing letters and numbers)', () =>
    createUser(wrongFormatPasswordUser).then(response => {
      expect(response.body.message).toContain(invalidPasswordMessage);
      expect(response.body.internal_code).toBe(VALIDATION_ERROR);
      expect(response.statusCode).toBe(422);
    }));

  it(`should fail because email is not ${EMAIL_DOMAIN}`, () =>
    createUser(wrongDomainUser).then(response => {
      expect(response.body.message).toContain(invalidEmailDomainMessage);
      expect(response.body.internal_code).toBe(VALIDATION_ERROR);
      expect(response.statusCode).toBe(422);
    }));

  it('should fail because firstName is missing', () =>
    createUser(firstNameMissingUser).then(response => {
      expect(response.body.message).toContain(missingRequiredFieldsMessage);
      expect(response.body.message).toContain('firstName');
      expect(response.body.internal_code).toBe(MISSING_DATA_ERROR);
      expect(response.statusCode).toBe(400);
    }));

  it('should fail because lastName is missing', () =>
    createUser(lastNameMissingUser).then(response => {
      expect(response.body.message).toContain(missingRequiredFieldsMessage);
      expect(response.body.message).toContain('lastName');
      expect(response.body.internal_code).toBe(MISSING_DATA_ERROR);
      expect(response.statusCode).toBe(400);
    }));

  it('should fail because email is missing', () =>
    createUser(emailMissingUser).then(response => {
      expect(response.body.message).toContain(missingRequiredFieldsMessage);
      expect(response.body.message).toContain('email');
      expect(response.body.internal_code).toBe(MISSING_DATA_ERROR);
      expect(response.statusCode).toBe(400);
    }));

  it('should fail because password is missing', () =>
    createUser(passwordMissingUser).then(response => {
      expect(response.body.message).toContain(missingRequiredFieldsMessage);
      expect(response.body.message).toContain('password');
      expect(response.body.internal_code).toBe(MISSING_DATA_ERROR);
      expect(response.statusCode).toBe(400);
    }));

  it('should  fail because of several missing fields', () =>
    createUser(emptyUser).then(response => {
      const msg = response.body.message;
      expect(msg).toContain(missingRequiredFieldsMessage);
      expect(msg).toContain('firstName');
      expect(msg).toContain('lastName');
      expect(msg).toContain('email');
      expect(msg).toContain('password');
      expect(response.body.internal_code).toBe(MISSING_DATA_ERROR);
      expect(response.statusCode).toBe(400);
    }));

  it('should send a welcome email', () =>
    request
      .post('/users')
      .send(mockUser)
      .then(() => {
        expect(emails.sendWelcomeEmail).toHaveBeenCalled();
      }));
});

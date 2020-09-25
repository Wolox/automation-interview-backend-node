const chance = require('chance')();
const { mockUser, wrongFormatPasswordUser, wrongDomainUser, passwordTooShortUser } = require('./mockUsers');
const { EMAIL_DOMAIN } = require('../../app/helpers');
const { email, password } = mockUser;

exports.wrongPasswordUser = {
  email,
  password: chance.integer({ min: 0, max: 9 }) + chance.word({ length: 8 })
};

exports.unexistentUserNameUser = {
  email: chance.email({ domain: EMAIL_DOMAIN }),
  password
};

exports.missingPasswordUser = {
  email,
  password: null
};

exports.missignEmailUser = {
  email: null,
  password
};

exports.wrongDomainUser = {
  email: wrongDomainUser.email,
  password
};

exports.passwordTooShortUser = {
  email,
  password: passwordTooShortUser.password
};

exports.wrongFormatPasswordUser = {
  email,
  password: wrongFormatPasswordUser.password
};

exports.mockUser = mockUser;
exports.loggingUser = { email, password };

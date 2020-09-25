const chance = require('chance')();
const { EMAIL_DOMAIN } = require('../../app/helpers');
exports.mockUser = {
  firstName: chance.first(),
  lastName: chance.last(),
  email: chance.email({ domain: EMAIL_DOMAIN }),
  password: chance.word({ length: 8 }) + chance.integer({ min: 0, max: 9 })
};

exports.mockUserOnTheFly = () => ({
  firstName: chance.first(),
  lastName: chance.last(),
  email: chance.email({ domain: 'wolox.com.ar' }),
  password: chance.word({ length: 8 }) + chance.integer({ min: 0, max: 9 })
});

exports.passwordTooShortUser = {
  ...exports.mockUser,
  password: chance.word({ length: 2 }) + chance.integer({ min: 0, max: 9 })
};

exports.wrongFormatPasswordUser = {
  ...exports.mockUser,
  password: chance.word({ length: 10 })
};

exports.wrongDomainUser = {
  ...exports.mockUser,
  email: chance.email({ domain: 'different.com.ar' })
};

exports.firstNameMissingUser = {
  ...exports.mockUser,
  firstName: null
};

exports.lastNameMissingUser = {
  ...exports.mockUser,
  lastName: null
};

exports.emailMissingUser = {
  ...exports.mockUser,
  email: null
};

exports.passwordMissingUser = {
  ...exports.mockUser,
  password: null
};

exports.emptyUser = {};

const { User } = require('../models');
const { notFoundError } = require('../errors');
const { userNotFoundErrorMessage, ADMIN_ROLE } = require('../helpers');
const { handleError } = require('./commons/errorHandler');
const { createToken } = require('../helpers');
const { session } = require('../../config').common;

exports.getAllUsers = (role, offset, limit) =>
  User.getAll({ offset, limit, role }).catch(handleError('Unable to get users'));

exports.getUserById = id =>
  User.findBy({ id })
    .then(user => {
      if (!user) {
        throw notFoundError(userNotFoundErrorMessage);
      }
      return user;
    })
    .catch(handleError('Unable to find user'));

exports.getUserByEmail = email =>
  User.findBy({ email })
    .then(user => {
      if (!user) {
        throw notFoundError(userNotFoundErrorMessage);
      }
      return user;
    })
    .catch(handleError('Unable to find user'));
exports.createUser = user => User.create(user).catch(handleError('Unable to create new user'));

exports.createAdminUser = hashedUser =>
  User.createAdmin(hashedUser).catch(handleError(`Unable to create ${ADMIN_ROLE} user`));

exports.invalidateUserSessions = userId =>
  User.invalidateSessions(userId).catch(handleError('Unable to invalidate user sessions'));

exports.createSessionToken = user => {
  const today = Date.now() / 1000;
  const expirationDate = (Date.now() + session.expirationTime) / 1000;
  const token = createToken({
    userId: user.id,
    role: user.role,
    iat: today,
    exp: expirationDate
  });

  return {
    token,
    expirationDate
  };
};

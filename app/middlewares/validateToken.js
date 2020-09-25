const moment = require('moment');
const { decodeToken } = require('../helpers');
const logger = require('../logger');
const { authenticationError } = require('../errors');
const { User } = require('../models');
exports.validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  const checkToken = () =>
    new Promise((resolve, reject) => {
      try {
        resolve(decodeToken(authorization));
      } catch (e) {
        reject(e);
      }
    });

  const findUser = token => Promise.all([User.findBy({ id: token.userId }), token]);
  const checkActiveSessions = ([user, token]) => {
    if (!user) {
      throw authenticationError('User not found');
    }

    if (
      !user.sessionInvalid ||
      moment
        .unix(token.iat)
        .utc()
        .isAfter(moment.utc(user.sessionInvalid))
    ) {
      return token;
    }
    throw authenticationError('Invalid token');
  };
  const setLocalData = token => {
    req.locals = { ...req.locals, role: token.role, userId: token.userId };
    next();
  };

  return checkToken()
    .then(findUser)
    .then(checkActiveSessions)
    .then(setLocalData)
    .catch(e => {
      logger.error(e);
      if (e.internalCode) {
        next(e);
      }
      next(authenticationError('Invalid token'));
    });
};

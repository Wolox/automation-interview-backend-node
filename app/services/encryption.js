const bcrypt = require('bcryptjs');
const { SALT_ROUNDS } = require('../helpers/constants');
const logger = require('../logger');
const { encryptionError } = require('../errors');

const catchEncryptionError = error => {
  logger.error(error.message);
  throw encryptionError(error.message);
};

exports.hashPassword = user =>
  bcrypt
    .hash(user.password, SALT_ROUNDS)
    .then(password => ({ ...user, password }))
    .catch(catchEncryptionError);

exports.comparePassword = ({ user, password }) =>
  bcrypt.compare(password, user.password).catch(catchEncryptionError);

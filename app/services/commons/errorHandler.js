const logger = require('../../logger');
const { databaseError } = require('../../errors');
const { dbErrorCodes } = require('../../helpers');

exports.handleError = genericMessage => error => {
  logger.error(error);
  if (error.internalCode) {
    throw error;
  }

  const { message, errorFn } = dbErrorCodes[error.name] || { message: genericMessage };
  if (errorFn) {
    throw errorFn(`${genericMessage}. ${message}`);
  }
  logger.error(message);
  throw databaseError(genericMessage);
};

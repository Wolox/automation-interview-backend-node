const errors = require('../errors'),
  logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.DATABASE_ERROR]: 500,
  [errors.DEFAULT_ERROR]: 500,
  [errors.EXTERNAL_API_ERROR]: 502,
  [errors.VALIDATION_ERROR]: 422,
  [errors.ENCRYPTION_ERROR]: 500,
  [errors.ENTITY_ALREADY_EXISTS]: 422,
  [errors.MISSING_DATA_ERROR]: 400,
  [errors.AUTHENTICATION_ERROR]: 401,
  [errors.NOT_FOUND_ERROR]: 404,
  [errors.FORBIDDEN_ERROR]: 403,
  [errors.EMAIL_SEND_ERROR]: 500
};

exports.handle = (error, _, res, next) => {
  if (error.internalCode) {
    res.status(statusCodes[error.internalCode] || DEFAULT_STATUS_CODE);
  } else {
    // Unrecognized error, notifying it to rollbar.
    next(error);
    res.status(DEFAULT_STATUS_CODE);
  }
  logger.error(error.message);
  return res.send({
    errors: [{ code: error.internalCode || errors.DEFAULT_ERROR, message: error.message }],
    timestamp: new Date().toISOString()
  });
};

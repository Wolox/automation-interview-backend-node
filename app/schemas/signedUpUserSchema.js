const {
  EMAIL_DOMAIN,
  PASSWORD_FORMATS,
  MIN_LENGTH,
  invalidEmailDomainMessage,
  invalidPasswordMessage,
  invalidPasswordLengthMessage,
  MISSING_FIELD,
  matchInArray
} = require('../helpers');

exports.signedUpUserSchema = {
  email: {
    in: ['body'],
    isEmpty: {
      errorMessage: MISSING_FIELD,
      negated: true
    },
    isEmail: {
      errorMessage: 'Invalid email'
    },
    matches: {
      options: [EMAIL_DOMAIN],
      errorMessage: invalidEmailDomainMessage
    }
  },
  password: {
    in: ['body'],
    isEmpty: {
      errorMessage: MISSING_FIELD,
      negated: true
    },
    custom: {
      options: value => matchInArray(PASSWORD_FORMATS, value),
      errorMessage: invalidPasswordMessage
    },
    isLength: {
      options: {
        min: MIN_LENGTH
      },
      errorMessage: invalidPasswordLengthMessage
    }
  }
};

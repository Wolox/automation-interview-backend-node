exports.SALT_ROUNDS = 10;
// eslint-disable-next-line max-len
exports.EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gim;
exports.EMAIL_DOMAIN = 'wolox.com.ar';
exports.PASSWORD_FORMATS = [/[0-9]/, /[a-zA-Z]/];
exports.MIN_LENGTH = 8;
exports.alreadyExistsErrorMessage = 'The resource you are trying to create already exists';
exports.validationErrorMessage = 'There has been a validation error';
exports.missingRequiredFieldsMessage = 'missing required fields:';
exports.invalidPasswordMessage = 'Password format invalid';
exports.invalidPasswordLengthMessage = `Password must be at least ${exports.MIN_LENGTH} characters`;
exports.invalidEmailDomainMessage = `The email must be @${exports.EMAIL_DOMAIN}`;
exports.authenticationErrorMessage = 'Unable to authenticate credentials';
exports.usernameNotFoundErrorMessage = 'Username not found';
exports.MISSING_FIELD = 'missing_field';
exports.userNotFoundErrorMessage = 'The user you are looking for was not found';
exports.ADMIN_ROLE = 'admin';
exports.REGULAR_ROLE = 'regular';

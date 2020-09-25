const { forbiddenError } = require('../errors');
const { ADMIN_ROLE } = require('../helpers');

exports.validatePermissions = roles => (req, res, next) => {
  if (roles.includes(req.locals.role)) {
    return next();
  }
  return next(forbiddenError(`Not authorized. You must be one of: ${roles.join(', ')}`));
};

exports.validateAlbumPermissions = (req, res, next) => {
  const { userId, role } = req.locals;
  const requestedUserId = parseInt(req.params.userId);

  if (role === ADMIN_ROLE || requestedUserId === userId) {
    return next();
  }

  return next(forbiddenError('Not authorized. You may only see your own albums'));
};

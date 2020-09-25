const { factory } = require('factory-girl');
const { hashPassword } = require('../../app/services/encryption');
const { User, UserAlbum } = require('../../app/models');
const { EMAIL_DOMAIN, REGULAR_ROLE, ADMIN_ROLE } = require('../../app/helpers');
const { extractField } = require('../serializers/fieldExtractor');
const { createSessionToken } = require('../../app/services/usersService');
factory.define('user', User, {
  firstName: factory.chance('first'),
  lastName: factory.chance('last'),
  email: factory.seq('User.email', n => `mail-${n}@${EMAIL_DOMAIN}`),
  password: () => hashPassword({ password: '1234567ocho' }).then(hashed => hashed.password)
});

exports.runFactory = factoryName => count =>
  factory.createMany(factoryName, count).then(extractField('dataValues'));

factory.define('album', UserAlbum, {
  userId: 1,
  albumId: factory.seq('UserAlbum.albumId')
});

exports.authorizationFactory = {
  regular: id => ({ authorization: createSessionToken({ id, role: REGULAR_ROLE }).token }),
  admin: id => ({ authorization: createSessionToken({ id, role: ADMIN_ROLE }).token }),
  invalid: { authorization: 'invalid' }
};

const jwt = require('jwt-simple');
const config = require('../../config');
const { secret } = config.common.token;

exports.createToken = payload => jwt.encode(payload, secret);
exports.decodeToken = token => jwt.decode(token, secret);

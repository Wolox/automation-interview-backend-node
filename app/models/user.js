'use strict';
const { REGULAR_ROLE, ADMIN_ROLE } = require('../helpers');
const { extractField } = require('../serializers/fieldExtractor');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name'
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: REGULAR_ROLE
      },
      sessionInvalid: {
        type: DataTypes.DATE,
        field: 'session_invalidate',
        options: {
          timezone: '+00:00'
        }
      }
    },
    { underscored: true }
  );

  User.createAdmin = user => User.upsert({ ...user, role: ADMIN_ROLE });

  User.findBy = query => User.findOne({ where: { ...query } }).then(extractField('dataValues'));

  User.getAll = ({ offset, limit, role }) =>
    User.findAndCountAll({
      offset,
      limit,
      where: { role: role === 'admin' ? ['admin', 'regular'] : 'regular' }
    }).then(result => ({
      count: result.count,
      rows: extractField('dataValues')(result.rows)
    }));

  User.invalidateSessions = userId => User.update({ sessionInvalid: new Date() }, { where: { id: userId } });

  return User;
};

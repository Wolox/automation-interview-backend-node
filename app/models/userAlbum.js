'use strict';
const { extractField } = require('../serializers/fieldExtractor');

module.exports = (sequelize, DataTypes) => {
  const UserAlbum = sequelize.define(
    'UserAlbum',
    {
      albumId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'album_id'
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
      }
    },
    { underscored: true }
  );

  UserAlbum.createAlbum = (albumId, userId) =>
    UserAlbum.create({ albumId, userId }).then(extractField('dataValues'));

  UserAlbum.findBy = query => UserAlbum.findAll({ where: { ...query } });

  UserAlbum.removeAttribute('id');
  return UserAlbum;
};

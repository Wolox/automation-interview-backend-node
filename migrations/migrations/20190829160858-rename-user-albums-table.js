'use strict';

module.exports = {
  up: queryInterface => queryInterface.renameTable('Albums', 'UserAlbums'),

  down: queryInterface => queryInterface.renameTable('UserAlbums', 'Albums')
};

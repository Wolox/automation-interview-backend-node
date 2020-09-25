'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Users', 'session_invalidate', {
      type: Sequelize.DATE
    }),

  down: queryInterface => queryInterface.removeColumn('Users', 'session_invalidate')
};

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Users', 'role', {
      type: Sequelize.STRING,
      defaultValue: 'regular'
    }),

  down: queryInterface => queryInterface.removeColumn('Users', 'role')
};

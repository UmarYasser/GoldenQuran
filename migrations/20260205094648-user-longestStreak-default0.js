'use strict';

const { QueryTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('users','streak',{
      type: Sequelize.INTEGER,
      notNull:true,
      defaultValue:1
    })
    await queryInterface.changeColumn('users','longestStreak',{
      type: Sequelize.INTEGER,
      notNull:true,
      defaultValue:1
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Datatypes) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn('surahs','pageNumber',{
      type:Datatypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{msg:"Page Number is required..."}
      },
      defaultValue:1 // To avoid errors while migrating existing data
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

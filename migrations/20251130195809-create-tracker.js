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
    queryInterface.createTable('trackers',{ 
      id:{
        type:Datatypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
      },
      date:{
        type:Datatypes.DATE,
        allowNull:false,
        validate:{
          notNull:{msg:'Date is required...'}
        }
      },
      userId:{
        type:Datatypes.INTEGER,
        allowNull:false,
        validate:{
          notNull:{msg:'User ID is required...'}
        },
        references:{
          model:"users", // Pass the trableName in the model field
          key:"id"
        },
        unique:true
      },
      screenTime:{
        type:Datatypes.INTEGER,
        notNull:false,
        defaultValue:0
      },
      createdAt:{
        type:Datatypes.DATE,
        allowNull:false
      },
      updatedAt:{
        type:Datatypes.DATE,
        allowNull:false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
    */
    await queryInterface.dropTable('trackers');
   
  }
};

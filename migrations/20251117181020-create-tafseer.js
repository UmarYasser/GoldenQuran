'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Datatypes) {
    await queryInterface.createTable('tafseers',{
      id:{
        type: Datatypes.INTEGER,
        primaryKey:true,
        autoIncrement:true 
      },
      text:{
        type:Datatypes.STRING,
        allowNull:false,
        validate:{
          notNull:{msg:"Tafseer content is required..."}
        }
      },
      ayahId:{
        type:Datatypes.INTEGER,
        allowNull:false,
        references:{
            model:"ayat", // Pass the tableName, not the modelName
            key:"id" // Its Name in the referenced table
        },
        validate:{
            notNull:{msg:"ayahId is required..."}
        },
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
    await queryInterface.dropTable('tafseers')
  }
};

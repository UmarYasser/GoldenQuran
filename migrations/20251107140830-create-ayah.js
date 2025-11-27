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
    await queryInterface.createTable('ayat',{
    id:{
          type:Datatypes.INTEGER,
          primaryKey:true,
          autoIncrement:true
      },
      text:{
          type:Datatypes.STRING,
          allowNull:false,
          validate:{
              notNull:{msg:"Aya content is required..."}
          }
      },
      ayahNumber:{
          type:Datatypes.INTEGER,
          allowNull:false,
          validate:{
              notNull:{msg:"Aya number is required..."}
          }
      },
      surahId:{ // 👈 The foreign key of the table
          type:Datatypes.INTEGER,
          allowNull:false,
          references:{
              model:"surahs",// Pass the table names, not the model's
              key:"id"
          },
          validate:{
              notNull:{msg:"Surah ID is required..."}
          }
      },
      pageNumber:{
          type:Datatypes.INTEGER,
          allowNull:false,
          validate:{
              notNull:{msg:"Page Number is required..."}
          }
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
    await queryInterface.dropTable("ayat")
  }
};

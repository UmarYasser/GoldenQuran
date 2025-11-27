'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Datatypes) {
    await queryInterface.createTable('surahs',{
      id:{
        type:Datatypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      name:{
        type:Datatypes.STRING,
        allowNull:false
      },
      // ayat:{
      //   type:Datatypes.ARRAY(Datatypes.INTEGER), //⭐⭐
      //   allowNull:false
      // },
      ayatCount:{
        type:Datatypes.INTEGER,
        allowNull:false
      },
      juzNumber:{
        type:Datatypes.INTEGER,
        allowNull:false,
      },
      revelationPlace:{
        type:Datatypes.ENUM("Mecca","Madina"),
        allowNull:false
      },
      createdAt:{
        type:Datatypes.DATE,
        allowNull:false
      },
      updatedAt:{
        type:Datatypes.DATE,
        allowNull:false
      },
    })
  },

  async down (queryInterface, Datatypes) {
    await queryInterface.dropTable('surahs');
  }
};

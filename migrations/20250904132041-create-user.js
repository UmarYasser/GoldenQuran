'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      uuid:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull:false,
        unique:true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      
    password:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:'Password is required'}
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'user'
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
    },
    changePasswordAt:{
      type: DataTypes.DATE
    }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};

// ⭐Must add 'createdAt' & 'updatedAt' to each migration;
// Bec. sequelize will add them and try to INSERT/DELETE from them anyway
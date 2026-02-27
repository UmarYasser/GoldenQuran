'use strict';
const { Model} = require('sequelize');
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Post,Tracker}) { // relationships
      // define association here
      this.hasMany(Tracker,{foreignKey:'userId', as:'tracker'})
    }

    async comparePassword(enteredPass,passDB){
      return await bcrypt.compare(enteredPass,passDB)
    }
    //when calling res.json({ user})
    toJSON(){ // When returning an instance, hide the id.
      return {...this.get(),id:undefined,password:undefined,confirmPassword:undefined,uuid:undefined,changePasswordAt:undefined}
    }
  }
  User.init({ // Class Attributes
    uuid:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull:false,
      validate:{
        notNull:{msg:"UUID is required.."}
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{msg:"User name is required.."}
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{msg:'Email is required'},
        isEmail: {msg:'Enter a valid Email!'}
      },
      unique:true
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:'Password is required......'}
      }
    },
    confirmPassword:{
      type:DataTypes.VIRTUAL,
      allowNull:false,
      validate:{
        notNull:{msg:'Confirm Password is required...'},
        isEqual(value){
          if(value !== this.password){
            throw new Error('Passwords do not match')
          }
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'user'
    },
    changePasswordAt:{
      type: DataTypes.DATE      
    },
    streak:{
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    longestStreak:{
      type: DataTypes.INTEGER,
      defaultValue:1
    }
  }, {
    sequelize: sequelize, // ⭐Must pass the sequelize connection (1st para. in the factory fn)
    modelName: 'User',
    tableName: 'users',
    freezeTableName:true,
    hooks:{
      // Using beforeSave will make a new hash for the password everytime the user gets saved, we only want it be hashed before creation
      beforeCreate: async(user)=>{
        if(user.password){
          const salt = await bcrypt.genSalt(10)
          user.password = await bcrypt.hash(user.password,salt)
        }
      }
    }
  });
  return User;
};


// ⭐⭐To save any modification done on a model => 
// 👉Create a new migration file
// 👉Edit the migration file to reflect the changes
// 👉Run the migration

//⭐⭐ To do what's above but for a table that has dependcies:
// 👉First undo the dependent table migration
// 👉Edit the migration file of the table
// 👉migrate both again

// ⭐⭐To make a change in a model without deleting data:
// 👉Create a new migration file ( for every change)
// 👉Run the migration


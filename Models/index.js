'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize('UmarDB', 'postgres', 'sql_professional', {
    host:'localhost',
    dialect:'postgres'
  });
}

fs // This is assigned to a var., bec. in forEach it process the db object itself on the run, no need to be called anywhere
  .readdirSync(__dirname) // ⭐The directory here is /Models/
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename && // ⭐The file basename is index.js, filters so no other file has the same index.js name
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })// What does it do?
  .forEach(file => { //⭐ Passes the datatypes which is the same parameter in the class 'factory' function.
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes); 
    db[model.name] = model;
     // In the 1st iteration, file = ayatModel.js, the model returned is Ayat, so db['Ayat'] = Ayat
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db); //db containes all the models created, so model1.associate(model2) can find  model2 in db
  }
});

db.sequelize = sequelize;
module.exports = db;


//For creating dbs: sequlize db:create                                         (No spaces are allowed between ','!)
//For creating tables(models): sequelize model:generate --name User --attributes name:string,age:Integer ...
 
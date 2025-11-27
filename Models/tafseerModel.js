'use strict';
const {Model} = require('sequelize');
// const { sequelize } = require('.');

module.exports = (sequelize, Datatypes) =>{
    class Tafseer extends Model{
        static associate({Ayah}){
            this.belongsTo(Ayah,{foreignKey: 'ayahId'})
        }
    }

    Tafseer.init({
        //   atts
            id:{
               type: Datatypes.INTEGER,
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
            ayahId:{
                type:Datatypes.INTEGER,
                allowNull:false,
                validate:{
                    notNull:{msg:"ayahId is required..."}
                },
                references:{
                    model:"Ayah",
                    key:"id"
                },
            }
        
        // ,{
        //     //options:sequelizeConnString hooks,tableName, modelName
        // }
 
    },{
        sequelize,
        tableName:'tafseers',
        modelName:'Tafseer',
        freezeTableName:'tafseers',
        hooks:{}

    })
    return Tafseer
}

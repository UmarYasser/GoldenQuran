'use strict';
const { Model } =require('sequelize');

module.exports = (sequelize, Datatypes) =>{
    class Surah extends Model {
        // Associaions, instance methods...
        static associate({Ayah}){ // 1-M
            this.hasMany(Ayah,{foreignKey: "surahId"})
        }// The reference arrow is from aya to surah, which means the foreign key is in ayah
        // So it's mentioned in both
    }

    Surah.init({
        id:{
            type:Datatypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name:{
            type:Datatypes.STRING,
            allowNull:false,
            validate:{
                notNull:{msg:'Surah Name is required...'}
            },
            unique:true
        },
        // ayat:{
        //     type:Datatypes.ARRAY(Datatypes.INTEGER),
        //     allowNull:false,
        //     validate:{ msg: "At least one aya id is required..."}
        // },DeepSeek: Use surahId instead, Make the id in the many table (Ayat) the foreign key

        ayatCount:{
            type:Datatypes.INTEGER,
            allowNull:false,
            validate:{
                notNull:{msg:'Ayat Count is required...'}
            }
        },// Page?? The ayah in the Ayat table should be the one that calls the page
        revelationPlace:{
            type:Datatypes.ENUM("Mecca","Madina"),

            allowNull:false,
            validate:{
                notNull:{msg:'Revelation Place is required...'},
                isIn:{
                    args:[["Mecca","Madina"]],
                    msg:"Revelation Place must be either Mecca or Madina..."
                }
            }
        },// Something Missing...
        juzNumber:{
            type:Datatypes.INTEGER,
            allowNull:false,
            validate:{
                notNull:{msg:"Juz Number is required..."}
            }
        },
        pageNumber:{
          type:Datatypes.INTEGER,
          allowNull:false,
          validate:{
              notNull:{msg:"Page Number is required..."}
          }
        }
    },{
        sequelize,
        modelName:'Surah',
        tableName:'surahs',
        freezeTableName:true,
        hooks:{}
    })
    return Surah;
}
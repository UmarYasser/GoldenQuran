'use strict'
const {Model} = require('sequelize')
const CustomError =  require('./../Utils/CustomError')

module.exports = (sequelize,Datatypes) =>{
    class Ayat extends Model{
        // Associations, instance methods...
        static associate({Surah, Tafseer}){ // M-1 and 1-1
            this.belongsTo(Surah,{foreignKey: "surahId", as:"surah"})
            this.hasOne(Tafseer,{foreignKey:"ayahId", as:"tafseer"})
        }

    }

    Ayat.init({
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
                model:"Surah",
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
        }
    },{
        sequelize,
        modelName:'Ayah',
        tableName:"ayat",
        freezeTableName:true,
        hooks:{ // I want to remove run validation on this hook, how? 
            beforeSave: (ayahDoc)=>{// If the ayah number matches the text ending
                // Only validate if text or ayahNumber is being changed
                if(ayahDoc.changed('text') || ayahDoc.changed('ayahNumber')){
                    if(ayahDoc.text){
                        ayahDoc.text = ayahDoc.text.trim()
                        let aNum = ayahDoc.text.length-2
                        if(ayahDoc.ayahNumber != ayahDoc.text[aNum]){
                            // To prevent saving
                            throw new CustomError("Check Ayah Number!",400)
                        }
                    }
                }
            },
        },
        indexes:[
            {// To make sure no duplicate ayah exists in a surah
                unique:true,
                fields:['surahId','ayahNumber']
            }
        ]
    })
    return Ayat
}

//What's left? Page Distribution⭐
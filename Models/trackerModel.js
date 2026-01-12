const {Model} = require('sequelize')

module.exports = (sequelize, Datatypes) =>{
    class Tracker extends Model{
        // Associations, instance methods...
        static associate({User}){
            this.belongsTo(User,{foreignKey:'userId', as:'user'})
        }
    }

    Tracker.init({
        // Att...
        id:{
            type:Datatypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        date:{
            // type:Datatypes.DATE,
            //⭐ DATEONLY: '2025-12-14', DATE: '2025-12-14 00:00:0000'
            type:Datatypes.DATEONLY,
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
                model:"User",
                key:"id"
            }
        },
        screenTime:{
            type:Datatypes.INTEGER,
            notNull:false,
            defaultValue:0
        },
        pagesRead:{
            type:Datatypes.INTEGER,
            defaultValue:0
        }

    },{
        sequelize,
        modelName:'Tracker',
        tableName:'trackers',
        freezeTableName:true,
        indexes:[
            {
                type:'UNIQUE',
                fields:['userId','date']
            }
        ]
    })
    return Tracker
}
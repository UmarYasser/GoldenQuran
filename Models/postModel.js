'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) { // 'Relations'
      // define association here
      this.belongsTo(User,{foreignKey:'userId'})
    }

    toJSON(){
      return {...this.get(),userId:undefined,id:undefined,uuid:undefined}
    }
  }
  Post.init({
    uuid:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      allowNull:false
    },
    caption:{
      type: DataTypes.STRING,
      allowNull:false
    },
    body: {
      type: DataTypes.STRING,
      allowNull:false
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
  });
  return Post;
};
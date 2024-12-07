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
        static associate(models) {
            //Allcode
            Post.belongsTo(models.Allcode, { foreignKey: 'statusCode', targetKey: 'code', as: 'statusPostData' })
            
            // User
            Post.belongsTo(models.User,{foreignKey: 'userId', targetKey: 'id', as: 'userPostData' })

            // //Cv
            Post.hasMany(models.Cv,{foreignKey:'postId',as:'postCvData'})

            //DetailPost
            Post.belongsTo(models.DetailPost,{foreignKey: 'detailPostId', targetKey: 'id', as: 'postDetailData' })

            //Note
            Post.hasMany(models.Note,{foreignKey:'postId',as:'postNoteData'})
        }
    };
    Post.init({
        statusCode: DataTypes.STRING,
        timeEnd: DataTypes.STRING,
        timePost: DataTypes.STRING,
        userId: DataTypes.INTEGER,
        isHot: DataTypes.TINYINT,
        detailPostId: DataTypes.INTEGER
    }, 
    {
        sequelize,
        modelName: 'Post',
    });
    return Post;
};
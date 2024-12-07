'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserSkill extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            UserSkill.belongsTo(models.User);
            UserSkill.belongsTo(models.Skill);
        }
    };
    UserSkill.init({
    }, 
    {
        sequelize,
        modelName: 'UserSkill',
        timestamps: false
    });
    return UserSkill;
};
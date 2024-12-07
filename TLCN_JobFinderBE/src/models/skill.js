'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Skill extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //Allcode
            Skill.belongsTo(models.Allcode, { foreignKey: 'categoryJobCode', targetKey: 'code', as: 'jobTypeSkillData' })

            //UserSkill - User
            Skill.belongsToMany(models.User, { through: models.UserSkill});
        }
    };
    Skill.init({
        name: DataTypes.STRING,
        categoryJobCode: DataTypes.STRING
    }, 
    {
        sequelize,
        modelName: 'Skill',
        timestamps: false
    });
    return Skill;
};
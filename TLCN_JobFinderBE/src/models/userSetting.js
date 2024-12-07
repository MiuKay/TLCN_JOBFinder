'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserSetting extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //Allcode
            UserSetting.belongsTo(models.Allcode, { foreignKey: 'categoryJobCode', targetKey: 'code', as: 'jobTypeSettingData' })
            UserSetting.belongsTo(models.Allcode, { foreignKey: 'salaryJobCode', targetKey: 'code', as: 'salaryTypeSettingData' })
            UserSetting.belongsTo(models.Allcode, { foreignKey: 'experienceJobCode', targetKey: 'code', as: 'expTypeSettingData' })
            UserSetting.belongsTo(models.Allcode, { foreignKey: 'addressCode', targetKey: 'code', as: 'provinceSettingData' })

            //User
            UserSetting.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userSettingData' })

        }
    };
    UserSetting.init({
        categoryJobCode: DataTypes.STRING,
        addressCode: DataTypes.STRING,
        salaryJobCode: DataTypes.STRING,
        experienceJobCode: DataTypes.STRING,
        isTakeMail: DataTypes.TINYINT,
        isFindJob: DataTypes.TINYINT,
        file: DataTypes.BLOB('long'),
        userId: DataTypes.TINYINT
    }, 
    {
        sequelize,
        modelName: 'UserSetting',
        timestamps: false
    });
    return UserSetting;
};
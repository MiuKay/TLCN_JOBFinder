'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Account extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //Allcode
            Account.belongsTo(models.Allcode, { foreignKey: 'roleCode', targetKey: 'code', as: 'roleData' })
            Account.belongsTo(models.Allcode, { foreignKey: 'statusCode', targetKey: 'code', as: 'statusAccountData' })
            
            // //Company
            // User.belongsTo(models.Company, { foreignKey: 'companyId', targetKey: 'id', as: 'CompanyData' })
            // User.hasOne(models.Company, { foreignKey: 'userId', as: 'userData' })

            // //Cv
            // User.hasMany(models.Cv, { foreignKey: 'userId', as: 'userData' })

            // //Notification
            // User.hasMany(models.Notification, { foreignKey: 'userId', as: 'userData' })
            
            // User
            Account.belongsTo(models.User,{foreignKey:'userId',targetKey:'id',as:'userAccountData'})
        }
    };
    Account.init({
        phonenumber: DataTypes.STRING,
        password: DataTypes.STRING,
        roleCode: DataTypes.STRING,
        statusCode: DataTypes.STRING,
        userId: DataTypes.INTEGER
    }, 
    {
        sequelize,
        modelName: 'Account',
    });
    return Account;
};
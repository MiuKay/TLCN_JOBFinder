'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Company extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //Allcode
            Company.belongsTo(models.Allcode, { foreignKey: 'statusCode',targetKey:'code' ,as: 'statusCompanyData' })
            Company.belongsTo(models.Allcode, { foreignKey: 'censorCode',targetKey:'code', as: 'censorData' })

            //User
            Company.hasMany(models.User,{foreignKey:'companyId',as: 'userCompanyData'})
            Company.belongsTo(models.User,{foreignKey:'userId',targetKey:'id',as:'companyUserData'})
            
        }
    };
    Company.init({
        name: DataTypes.STRING,
        thumbnail: DataTypes.STRING,
        coverimage: DataTypes.STRING,
        descriptionHTML: DataTypes.TEXT('long'),
        descriptionMarkdown: DataTypes.TEXT('long'),
        website: DataTypes.STRING,
        address: DataTypes.STRING,
        phonenumber: DataTypes.STRING,
        amountEmployer: DataTypes.INTEGER,
        taxnumber: DataTypes.STRING,
        statusCode: DataTypes.STRING,
        userId: DataTypes.INTEGER,
        censorCode: DataTypes.STRING,
        file: DataTypes.BLOB('long'),
        allowPost: DataTypes.INTEGER,
        allowHotPost: DataTypes.INTEGER,
        allowCvFree: DataTypes.INTEGER,
        allowCv: DataTypes.INTEGER,
    }, 
    {
        sequelize,
        modelName: 'Company',
    });
    return Company;
};
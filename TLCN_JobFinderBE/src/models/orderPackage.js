'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderPackage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
           //User
           OrderPackage.belongsTo(models.User,{foreignKey:'userId',targetKey:'id',as: 'userOrderData'})

           //PackagePost
           OrderPackage.belongsTo(models.PackagePost, {foreignKey: 'packagePostId',targetKey:'id',as:'packageOrderData'})

        }
    };
    OrderPackage.init({
        packagePostId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        currentPrice: DataTypes.DOUBLE,
        amount: DataTypes.INTEGER
    }, 
    {
        sequelize,
        modelName: 'OrderPackage',
    });
    return OrderPackage;
};
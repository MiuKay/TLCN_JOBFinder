'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        //     //Allcode
        //    Notification.belongsTo(models.Allcode,{foreignKey:'typeCode',targetKey:'code',as:'typeData'})

        //    //User
        //    Notification.belongsTo(models.User,{foreignKey:'userId',targetKey:'id',as:'userData'})
        }
    };
    Notification.init({
        userId: DataTypes.INTEGER,
        typeCode: DataTypes.STRING,
        isChecked: DataTypes.TINYINT,
    }, 
    {
        sequelize,
        modelName: 'Notification',
    });
    return Notification;
};
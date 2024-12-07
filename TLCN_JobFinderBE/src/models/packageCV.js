'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PackageCv extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            //orderpackage
            PackageCv.hasMany(models.OrderPackage,{foreignKey: 'packageCvId',as:'packageOrderCvData'})

        }
    };
    PackageCv.init({
        name: DataTypes.STRING,
        value: DataTypes.INTEGER,
        price: DataTypes.DOUBLE,
        isActive: DataTypes.TINYINT
    }, 
    {
        sequelize,
        modelName: 'PackageCv',
        timestamps: false
    });
    return PackageCv;
};
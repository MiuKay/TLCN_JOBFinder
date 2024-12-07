'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('PackagePosts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
                unique: true
            },
            value: {
                type: Sequelize.STRING
            },
            price: {
                type: Sequelize.DOUBLE
            },
            isHot: {
                type: Sequelize.TINYINT
            },
            isActive: {
                type: Sequelize.TINYINT
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('PackagePosts');
    }
};
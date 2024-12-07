'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Accounts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            phonenumber:{
                type: Sequelize.STRING,
                unique: true
            },
            password:{
                type: Sequelize.STRING
            },
            roleCode: {
                type: Sequelize.STRING,
                references: {
                    model: {
                        tableName: 'Allcodes'
                    },
                    key: 'code',
                },
                onUpdate: 'CASCADE',
            },
            statusCode: {
                type: Sequelize.STRING,
                references: {
                    model: {
                        tableName: 'Allcodes'
                    },
                    key: 'code',
                },
                onUpdate: 'CASCADE',
            },
            userId: {
                type: Sequelize.INTEGER,
                unique: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Accounts');
    }
};
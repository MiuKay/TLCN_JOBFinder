'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Skills', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            categoryJobCode: {
                type: Sequelize.STRING,
                references: {
                    model: {
                        tableName: 'Allcodes'
                    },
                    key: 'code',
                },
                onUpdate: 'CASCADE',
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Skills');
    }
};
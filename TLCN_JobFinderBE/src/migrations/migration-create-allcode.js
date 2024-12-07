'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Allcodes', {
            code: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            type: {
                type: Sequelize.STRING
            },
            value: {
                type: Sequelize.STRING
            },
            image: {
                type: Sequelize.STRING
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Allcodes');
    }
};
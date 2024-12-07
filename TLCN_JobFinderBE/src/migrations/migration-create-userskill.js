'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('UserSkills', {
            userId: {
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            skillId: {
                primaryKey: true,
                type: Sequelize.INTEGER
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('UserSkills');
    }
};
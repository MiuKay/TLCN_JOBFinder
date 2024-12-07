'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            firstName: {
                type: Sequelize.STRING
            },
            lastName: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            genderCode: {
                type: Sequelize.STRING,
                references: {
                    model: {
                        tableName: 'Allcodes'
                    },
                    key: 'code',
                },
                onUpdate: 'CASCADE',                
            },

            image: {
                type: Sequelize.STRING
            },
            dob: {
                type: Sequelize.STRING
            },
            companyId: {
                type: Sequelize.INTEGER,
                foreignKey: true
            },
            // file: {
            //     type: Sequelize.BLOB('long')
            // }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    }
};
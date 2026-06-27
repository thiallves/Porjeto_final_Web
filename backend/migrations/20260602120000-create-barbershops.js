'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('barbershops', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
      address: { type: Sequelize.STRING, allowNull: false },
      city: { type: Sequelize.STRING, allowNull: false },
      neighborhood: { type: Sequelize.STRING, allowNull: false },
      latitude: { type: Sequelize.FLOAT, allowNull: true },
      longitude: { type: Sequelize.FLOAT, allowNull: true },
      openingTime: { type: Sequelize.TIME, allowNull: false, defaultValue: '08:00:00' },
      closingTime: { type: Sequelize.TIME, allowNull: false, defaultValue: '18:00:00' },
      cancellationLimitHours: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 2 },
      dailyAppointmentLimit: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 30 },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('barbershops');
  },
};

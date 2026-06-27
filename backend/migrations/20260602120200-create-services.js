'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('services', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      name: { type: Sequelize.ENUM('CORTE_MAQUINA', 'CORTE_TESOURA', 'BARBA'), allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      duration: { type: Sequelize.INTEGER, allowNull: false },
      barbershopId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'barbershops', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('services');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_services_name";');
  },
};

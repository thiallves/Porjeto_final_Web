'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const adminPassword = await bcrypt.hash('123456', 10);
    const userPassword = await bcrypt.hash('123456', 10);

    await queryInterface.bulkInsert('barbershops', [
      {
        id: 1,
        name: 'Barbearia Central',
        address: 'Rua A, 100',
        city: 'Rio de Janeiro',
        neighborhood: 'Centro',
        latitude: -22.9068,
        longitude: -43.1729,
        openingTime: '08:00:00',
        closingTime: '18:00:00',
        cancellationLimitHours: 2,
        dailyAppointmentLimit: 30,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'Admin',
        email: 'admin@email.com',
        password: adminPassword,
        phone: '11999999999',
        role: 'ADMIN',
        barbershopId: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        name: 'Barbeiro Teste',
        email: 'barbeiro@email.com',
        password: userPassword,
        phone: '11988888888',
        role: 'BARBEIRO',
        barbershopId: 1,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        name: 'Cliente Teste',
        email: 'cliente@email.com',
        password: userPassword,
        phone: '11977777777',
        role: 'CLIENTE',
        barbershopId: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert('services', [
      { id: 1, name: 'CORTE_MAQUINA', price: 25.0, duration: 20, barbershopId: 1, isActive: true, createdAt: now, updatedAt: now },
      { id: 2, name: 'CORTE_TESOURA', price: 35.0, duration: 30, barbershopId: 1, isActive: true, createdAt: now, updatedAt: now },
      { id: 3, name: 'BARBA', price: 20.0, duration: 15, barbershopId: 1, isActive: true, createdAt: now, updatedAt: now },
    ]);



    await queryInterface.bulkInsert('appointments', [
      {
        id: 1,
        userId: 3,
        barberId: 2,
        serviceId: 1,
        barbershopId: 1,
        date: new Date('2026-07-01T14:00:00'),
        endDate: new Date('2026-07-01T14:20:00'),
        status: 'CONCLUIDO',
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert('categories', [
      { id: 1, name: 'Cortes', description: 'Serviços de cabelo', isActive: true, createdAt: now, updatedAt: now },
      { id: 2, name: 'Barba', description: 'Serviços de barba e acabamento', isActive: true, createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('professionals', [
      { id: 1, name: 'Rafael Navalha', email: 'rafael@navalha.com', phone: '21999990000', specialty: 'Corte e barba', barbershopId: 1, isActive: true, createdAt: now, updatedAt: now },
      { id: 2, name: 'Bruno Fade', email: 'bruno@navalha.com', phone: '21988880000', specialty: 'Degradê', barbershopId: 1, isActive: true, createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('work_schedules', [
      { id: 1, professionalId: 1, barbershopId: 1, dayOfWeek: 1, startTime: '08:00:00', endTime: '18:00:00', isActive: true, createdAt: now, updatedAt: now },
      { id: 2, professionalId: 2, barbershopId: 1, dayOfWeek: 2, startTime: '09:00:00', endTime: '17:00:00', isActive: true, createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('products', [
      { id: 1, name: 'Pomada Modeladora', description: 'Fixação forte', price: 39.90, stock: 15, barbershopId: 1, isActive: true, createdAt: now, updatedAt: now },
      { id: 2, name: 'Óleo para Barba', description: 'Hidratação e brilho', price: 29.90, stock: 20, barbershopId: 1, isActive: true, createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('coupons', [
      { id: 1, code: 'NAVALHA10', description: 'Desconto de boas-vindas', discountPercent: 10, expiresAt: new Date('2026-12-31'), isActive: true, createdAt: now, updatedAt: now },
      { id: 2, code: 'BARBA15', description: 'Desconto em serviços de barba', discountPercent: 15, expiresAt: new Date('2026-12-31'), isActive: true, createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('reviews', [
      { id: 1, userId: 3, barbershopId: 1, appointmentId: 1, rating: 5, comment: 'Atendimento excelente.', isActive: true, createdAt: now, updatedAt: now },
    ]);

  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('reviews', null, {});
    await queryInterface.bulkDelete('coupons', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('work_schedules', null, {});
    await queryInterface.bulkDelete('professionals', null, {});
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('appointments', null, {});
    await queryInterface.bulkDelete('services', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('barbershops', null, {});
  },
};

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Appointment } from '../../database/models/appointment.model';
import { Service } from '../../database/models/service.model';
import { Barbershop } from '../../database/models/barbershop.model';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentsRepository } from './repositories/appointments.repository';
import { ServicesRepository } from '../services/repositories/services.repository';
import { BarbershopsRepository } from '../barbershops/repositories/barbershops.repository';

@Module({
  imports: [SequelizeModule.forFeature([Appointment, Service, Barbershop])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsRepository, ServicesRepository, BarbershopsRepository],
})
export class AppointmentsModule {}

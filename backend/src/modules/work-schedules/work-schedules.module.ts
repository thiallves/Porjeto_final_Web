import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WorkSchedule } from '../../database/models/workSchedule.model';
import { WorkScheduleController } from './work-schedules.controller';
import { WorkScheduleService } from './work-schedules.service';
import { WorkScheduleRepository } from './repositories/work-schedules.repository';

@Module({
  imports: [SequelizeModule.forFeature([WorkSchedule])],
  controllers: [WorkScheduleController],
  providers: [WorkScheduleService, WorkScheduleRepository],
})
export class WorkScheduleModule {}

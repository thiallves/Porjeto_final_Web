import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkSchedule } from '../../../database/models/workSchedule.model';

@Injectable()
export class WorkScheduleRepository {
  constructor(@InjectModel(WorkSchedule) private readonly model: typeof WorkSchedule) {}

  create(data: any) { return this.model.create(data); }
  findAndCountAll(options: any) { return this.model.findAndCountAll(options); }
  findById(id: number) { return this.model.findByPk(id); }
}

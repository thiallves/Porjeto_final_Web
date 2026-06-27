import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CountOptions, FindAndCountOptions, FindOptions, WhereOptions } from 'sequelize';
import { Appointment } from '../../../database/models/appointment.model';

@Injectable()
export class AppointmentsRepository {
  constructor(@InjectModel(Appointment) private readonly model: typeof Appointment) {}

  create(data: any) {
    return this.model.create(data);
  }

  findById(id: number) {
    return this.model.findByPk(id);
  }

  findOne(where: WhereOptions) {
    return this.model.findOne({ where });
  }

  findAll(options: FindOptions) {
    return this.model.findAll(options);
  }

  findAndCountAll(options: FindAndCountOptions) {
    return this.model.findAndCountAll(options);
  }

  count(options: CountOptions) {
    return this.model.count(options);
  }
}

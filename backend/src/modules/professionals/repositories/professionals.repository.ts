import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Professional } from '../../../database/models/professional.model';

@Injectable()
export class ProfessionalRepository {
  constructor(@InjectModel(Professional) private readonly model: typeof Professional) {}

  create(data: any) { return this.model.create(data); }
  findAndCountAll(options: any) { return this.model.findAndCountAll(options); }
  findById(id: number) { return this.model.findByPk(id); }
}

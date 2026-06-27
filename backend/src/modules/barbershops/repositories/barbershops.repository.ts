import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAndCountOptions, FindOptions } from 'sequelize';
import { Barbershop } from '../../../database/models/barbershop.model';

@Injectable()
export class BarbershopsRepository {
  constructor(@InjectModel(Barbershop) private readonly model: typeof Barbershop) {}

  create(data: any) {
    return this.model.create(data);
  }

  findById(id: number) {
    return this.model.findByPk(id);
  }

  findAndCountAll(options: FindAndCountOptions) {
    return this.model.findAndCountAll(options);
  }

  findAll(options: FindOptions) {
    return this.model.findAll(options);
  }
}

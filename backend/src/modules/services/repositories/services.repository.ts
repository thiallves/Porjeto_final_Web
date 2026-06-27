import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAndCountOptions, FindOptions, WhereOptions } from 'sequelize';
import { Service } from '../../../database/models/service.model';

@Injectable()
export class ServicesRepository {
  constructor(@InjectModel(Service) private readonly model: typeof Service) {}

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
}

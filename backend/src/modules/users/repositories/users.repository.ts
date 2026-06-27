import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAndCountOptions } from 'sequelize';
import { User } from '../../../database/models/user.model';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User) private readonly model: typeof User) {}

  create(data: any) {
    return this.model.create(data);
  }

  findByEmail(email: string) {
    return this.model.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.model.findByPk(id);
  }

  findAndCountAll(options: FindAndCountOptions) {
    return this.model.findAndCountAll(options);
  }
}

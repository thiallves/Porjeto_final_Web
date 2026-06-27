import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from '../../../database/models/category.model';

@Injectable()
export class CategoryRepository {
  constructor(@InjectModel(Category) private readonly model: typeof Category) {}

  create(data: any) { return this.model.create(data); }
  findAndCountAll(options: any) { return this.model.findAndCountAll(options); }
  findById(id: number) { return this.model.findByPk(id); }
}

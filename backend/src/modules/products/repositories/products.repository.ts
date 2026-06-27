import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../../../database/models/product.model';

@Injectable()
export class ProductRepository {
  constructor(@InjectModel(Product) private readonly model: typeof Product) {}

  create(data: any) { return this.model.create(data); }
  findAndCountAll(options: any) { return this.model.findAndCountAll(options); }
  findById(id: number) { return this.model.findByPk(id); }
}

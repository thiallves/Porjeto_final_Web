import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from '../../../database/models/review.model';

@Injectable()
export class ReviewRepository {
  constructor(@InjectModel(Review) private readonly model: typeof Review) {}

  create(data: any) { return this.model.create(data); }
  findAndCountAll(options: any) { return this.model.findAndCountAll(options); }
  findById(id: number) { return this.model.findByPk(id); }
}

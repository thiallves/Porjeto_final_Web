import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Coupon } from '../../../database/models/coupon.model';

@Injectable()
export class CouponRepository {
  constructor(@InjectModel(Coupon) private readonly model: typeof Coupon) {}

  create(data: any) { return this.model.create(data); }
  findAndCountAll(options: any) { return this.model.findAndCountAll(options); }
  findById(id: number) { return this.model.findByPk(id); }
}

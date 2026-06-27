import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Coupon } from '../../database/models/coupon.model';
import { CouponController } from './coupons.controller';
import { CouponService } from './coupons.service';
import { CouponRepository } from './repositories/coupons.repository';

@Module({
  imports: [SequelizeModule.forFeature([Coupon])],
  controllers: [CouponController],
  providers: [CouponService, CouponRepository],
})
export class CouponModule {}

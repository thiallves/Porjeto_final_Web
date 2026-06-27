import { PartialType } from '@nestjs/swagger';
import { CreateCouponDto } from './create-coupons.dto';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {}

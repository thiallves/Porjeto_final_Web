import { IsOptional, IsString } from 'class-validator';

export class FilterCouponsDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  minDiscountPercent?: string;

  @IsOptional()
  @IsString()
  maxDiscountPercent?: string;

  @IsOptional()
  @IsString()
  expiresBefore?: string;

  @IsOptional()
  @IsString()
  expiresAfter?: string;

  @IsOptional()
  @IsString()
  isActive?: string;
}
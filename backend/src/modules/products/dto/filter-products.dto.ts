import { IsOptional, IsString } from 'class-validator';

export class FilterProductsDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  barbershopId?: string;

  @IsOptional()
  @IsString()
  minPrice?: string;

  @IsOptional()
  @IsString()
  maxPrice?: string;

  @IsOptional()
  @IsString()
  minStock?: string;

  @IsOptional()
  @IsString()
  maxStock?: string;

  @IsOptional()
  @IsString()
  isActive?: string;
}
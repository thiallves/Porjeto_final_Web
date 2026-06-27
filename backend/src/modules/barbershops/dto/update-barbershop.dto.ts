import { PartialType } from '@nestjs/swagger';
import { CreateBarbershopDto } from './create-barbershop.dto';
import { IsOptional, IsDateString } from 'class-validator';

export class UpdateBarbershopDto extends PartialType(CreateBarbershopDto) {
  
  @IsOptional()
  id?: number;

  @IsOptional()
  createdAt?: string;

  @IsOptional()
  updatedAt?: string;
}

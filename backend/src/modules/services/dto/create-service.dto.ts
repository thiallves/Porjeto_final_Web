import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ServiceType } from '../../../database/models/service.model';

export class CreateServiceDto {
  @ApiProperty({ enum: ServiceType, example: ServiceType.CORTE_MAQUINA })
  @IsEnum(ServiceType)
  name: ServiceType;

  @ApiProperty({ example: 25.0 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 30, description: 'Duração em minutos' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  duration: number;

  @ApiProperty({ example: 1, required: false, description: 'Obrigatório apenas para ADMIN sem barbearia vinculada' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  barbershopId?: number;
}

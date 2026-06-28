import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    example: 'Corte navalhado',
    description: 'Nome do serviço cadastrado pela barbearia',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 25.0 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price!: number;

  @ApiProperty({ example: 30, description: 'Duração em minutos' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  duration!: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Obrigatório apenas para ADMIN sem barbearia vinculada',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  barbershopId?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica se o serviço está ativo',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
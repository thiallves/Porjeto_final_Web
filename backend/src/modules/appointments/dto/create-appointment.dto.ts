import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: 1, required: false, description: 'Opcional: por padrão usa o usuário autenticado' })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  serviceId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  barbershopId: number;

  @ApiProperty({ example: '2026-06-10T14:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  barberId?: number;
}

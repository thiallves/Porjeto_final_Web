import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBarbershopDto {
  @ApiProperty({ example: 'Barbearia Central' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Rua A, 100' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Rio de Janeiro' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Centro' })
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiPropertyOptional({ example: -22.9 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: -43.2 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: '08:00:00' })
  @IsOptional()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/)
  openingTime?: string;

  @ApiPropertyOptional({ example: '18:00:00' })
  @IsOptional()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/)
  closingTime?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cancellationLimitHours?: number;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  dailyAppointmentLimit?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWorkScheduleDto {
  @IsNumber()
  professionalId: number;

  @IsNumber()
  barbershopId: number;

  @IsNumber()
  dayOfWeek: number;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

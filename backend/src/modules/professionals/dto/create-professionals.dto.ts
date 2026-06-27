import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProfessionalDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  specialty: string;

  @IsNumber()
  barbershopId: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

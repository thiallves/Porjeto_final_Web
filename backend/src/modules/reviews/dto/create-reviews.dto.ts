import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
 // @IsNumber()
  //userId: number;

  @IsNumber()
  barbershopId: number;

  @IsNumber()
  appointmentId: number;

  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

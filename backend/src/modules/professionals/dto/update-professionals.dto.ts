import { PartialType } from '@nestjs/swagger';
import { CreateProfessionalDto } from './create-professionals.dto';

export class UpdateProfessionalDto extends PartialType(CreateProfessionalDto) {}

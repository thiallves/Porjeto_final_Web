import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Professional } from '../../database/models/professional.model';
import { ProfessionalController } from './professionals.controller';
import { ProfessionalService } from './professionals.service';
import { ProfessionalRepository } from './repositories/professionals.repository';

@Module({
  imports: [SequelizeModule.forFeature([Professional])],
  controllers: [ProfessionalController],
  providers: [ProfessionalService, ProfessionalRepository],
})
export class ProfessionalModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Barbershop } from '../../database/models/barbershop.model';
import { BarbershopsController } from './barbershops.controller';
import { BarbershopsService } from './barbershops.service';
import { BarbershopsRepository } from './repositories/barbershops.repository';

@Module({
  imports: [SequelizeModule.forFeature([Barbershop])],
  controllers: [BarbershopsController],
  providers: [BarbershopsService, BarbershopsRepository],
  exports: [BarbershopsService, BarbershopsRepository],
})
export class BarbershopsModule {}

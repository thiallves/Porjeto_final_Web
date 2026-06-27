import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './database/database.module';
import { BarbershopsModule } from './modules/barbershops/barbershops.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ServicesModule } from './modules/services/services.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { CategoryModule } from './modules/categories/categories.module';
import { ProfessionalModule } from './modules/professionals/professionals.module';
import { WorkScheduleModule } from './modules/work-schedules/work-schedules.module';
import { ProductModule } from './modules/products/products.module';
import { CouponModule } from './modules/coupons/coupons.module';
import { ReviewModule } from './modules/reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    BarbershopsModule,
    AuthModule,
    UsersModule,
    ServicesModule,
    AppointmentsModule,
    CategoryModule,
    ProfessionalModule,
    WorkScheduleModule,
    ProductModule,
    CouponModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
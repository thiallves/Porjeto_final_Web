import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from './models/user.model';
import { Barbershop } from './models/barbershop.model';
import { Service } from './models/service.model';
import { Appointment } from './models/appointment.model';
import { Category } from './models/category.model';
import { Professional } from './models/professional.model';
import { WorkSchedule } from './models/workSchedule.model';
import { Product } from './models/product.model';
import { Coupon } from './models/coupon.model';
import { Review } from './models/review.model';

function parseDatabaseUrl(databaseUrl?: string) {
  if (!databaseUrl) return null;

  const url = new URL(databaseUrl);
  return {
    host: url.hostname,
    port: Number(url.port || 5432),
    username: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace('/', ''),
    ssl: url.searchParams.get('sslmode') === 'require',
  };
}

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const parsedUrl = parseDatabaseUrl(config.get<string>('DATABASE_URL'));
        const useSsl = parsedUrl?.ssl || config.get<string>('DB_SSL') === 'true';

        return {
          dialect: 'postgres',
          host: parsedUrl?.host || config.get<string>('DB_HOST', 'localhost'),
          port: parsedUrl?.port || Number(config.get<number>('DB_PORT', 5432)),
          username: parsedUrl?.username || config.get<string>('DB_USER', 'postgres'),
          password: parsedUrl?.password || config.get<string>('DB_PASS', '1234'),
          database: parsedUrl?.database || config.get<string>('DB_NAME', 'barbearia_db'),
          models: [User, Barbershop, Service, Appointment, Category, Professional, WorkSchedule, Product, Coupon, Review],
          autoLoadModels: true,
          synchronize: false,
          logging: false,
          dialectOptions: useSsl
            ? {
                ssl: {
                  require: true,
                  rejectUnauthorized: false,
                },
              }
            : undefined,
        };
      },
    }),
  ],
})
export class DatabaseModule {}

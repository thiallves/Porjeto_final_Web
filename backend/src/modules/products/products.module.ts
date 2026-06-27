import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from '../../database/models/product.model';
import { ProductController } from './products.controller';
import { ProductService } from './products.service';
import { ProductRepository } from './repositories/products.repository';

@Module({
  imports: [SequelizeModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}

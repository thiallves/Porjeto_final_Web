import { Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { ProductRepository } from './repositories/products.repository';

@Injectable()
export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  create(data: CreateProductDto) {
    return this.repository.create(data);
  }

  async findAll(filters: FilterProductsDto = {}) {
    const page = Math.max(Number(filters.page) || 1, 1);
    const limit = Math.min(Math.max(Number(filters.limit) || 10, 1), 100);

    const where: any = {};

    if (filters.name) {
      where.name = { [Op.iLike]: `%${filters.name}%` };
    }

    if (filters.description) {
      where.description = { [Op.iLike]: `%${filters.description}%` };
    }

    if (filters.barbershopId) {
      where.barbershopId = Number(filters.barbershopId);
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};

      if (filters.minPrice) {
        where.price[Op.gte] = Number(filters.minPrice);
      }

      if (filters.maxPrice) {
        where.price[Op.lte] = Number(filters.maxPrice);
      }
    }

    if (filters.minStock || filters.maxStock) {
      where.stock = {};

      if (filters.minStock) {
        where.stock[Op.gte] = Number(filters.minStock);
      }

      if (filters.maxStock) {
        where.stock[Op.lte] = Number(filters.maxStock);
      }
    }

    if (filters.isActive !== undefined) {
      where.isActive = String(filters.isActive) === 'true';
    }

    const { rows, count } = await this.repository.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'ASC']],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      lastPage: Math.ceil(count / limit),
    };
  }

  async findOne(id: number) {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new NotFoundException('Produto não encontrado');
    }

    return item;
  }

  async replace(id: number, data: CreateProductDto) {
    const item = await this.findOne(id);
    await item.update(data);
    return item;
  }

  async update(id: number, data: UpdateProductDto) {
    const item = await this.findOne(id);
    await item.update(data);
    return item;
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await item.destroy();

    return {
      message: 'Produto removido com sucesso',
    };
  }
}
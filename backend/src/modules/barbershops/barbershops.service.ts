import { Injectable, NotFoundException } from '@nestjs/common';
import { Op, Sequelize } from 'sequelize';
import { CreateBarbershopDto } from './dto/create-barbershop.dto';
import { FilterBarbershopDto } from './dto/filter-barbershop.dto';
import { UpdateBarbershopDto } from './dto/update-barbershop.dto';
import { BarbershopsRepository } from './repositories/barbershops.repository';

@Injectable()
export class BarbershopsService {
  constructor(private readonly repository: BarbershopsRepository) {}

  create(data: CreateBarbershopDto) {
    return this.repository.create(data);
  }

  async findAll(filters: FilterBarbershopDto) {
    const page = Math.max(Number(filters.page) || 1, 1);
    const limit = Math.min(Math.max(Number(filters.limit) || 10, 1), 100);
    const { city, name, neighborhood } = filters;

    const where: any = {};
    if (city) where.city = { [Op.iLike]: `%${city}%` };
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (neighborhood) where.neighborhood = { [Op.iLike]: `%${neighborhood}%` };

    const { rows, count } = await this.repository.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'ASC']],
    });

    return { data: rows, total: count, page, limit, lastPage: Math.ceil(count / limit) };
  }

  async findOne(id: number) {
    const barbershop = await this.repository.findById(id);
    if (!barbershop) throw new NotFoundException('Barbearia não encontrada');
    return barbershop;
  }

  async update(id: number, data: UpdateBarbershopDto) {
    const barbershop = await this.repository.findById(id);
    if (!barbershop) throw new NotFoundException('Barbearia não encontrada');
    await barbershop.update(data);
    return barbershop;
  }

  async remove(id: number) {
    const barbershop = await this.repository.findById(id);
    if (!barbershop) throw new NotFoundException('Barbearia não encontrada');
    await barbershop.destroy();
    return { message: 'Barbearia removida com sucesso' };
  }

  async findNearby(lat: number, lng: number) {
    return this.repository.findAll({
      attributes: {
        include: [[Sequelize.literal(`(6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitude))))`), 'distance']],
      },
      order: [[Sequelize.literal('distance'), 'ASC']],
    });
  }
}

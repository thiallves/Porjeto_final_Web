import { Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { CreateProfessionalDto } from './dto/create-professionals.dto';
import { UpdateProfessionalDto } from './dto/update-professionals.dto';
import { ProfessionalRepository } from './repositories/professionals.repository';

@Injectable()
export class ProfessionalService {
  constructor(private readonly repository: ProfessionalRepository) { }

  create(data: CreateProfessionalDto) {
    return this.repository.create(data);
  }

  async findAll(filters: any = {}) {
    const page = Math.max(Number(filters.page) || 1, 1);
    const limit = Math.min(Math.max(Number(filters.limit) || 10, 1), 100);
    const where: any = {};


    if (filters.name) where.name = { [Op.iLike]: `%${filters.name}%` };
    if (filters.email) where.email = { [Op.iLike]: `%${filters.email}%` };
    if (filters.specialty) where.specialty = { [Op.iLike]: `%${filters.specialty}%` };
    if (filters.barbershopId) where.barbershopId = Number(filters.barbershopId);
    if (filters.professionalId) where.professionalId = Number(filters.professionalId);
    if (filters.isActive !== undefined) where.isActive = String(filters.isActive) === 'true';

    const { rows, count } = await this.repository.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'ASC']],
    });
    return { data: rows, total: count, page, limit, lastPage: Math.ceil(count / limit) };
  }

  async findOne(id: number) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundException('Profissional não encontrado');
    return item;
  }

  async replace(id: number, data: CreateProfessionalDto) {
    const item = await this.findOne(id);
    await item.update(data);
    return item;
  }

  async update(id: number, data: UpdateProfessionalDto) {
    const item = await this.findOne(id);
    await item.update(data);
    return item;
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await item.destroy();
    return { message: 'Profissional removido com sucesso' };
  }
}

import { BadRequestException, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { ServiceType } from '../../database/models/service.model';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesRepository } from './repositories/services.repository';

@Injectable()
export class ServicesService {
  constructor(private readonly repository: ServicesRepository) { }

  async create(data: CreateServiceDto, user: any) {
    const barbershopId = user?.role === 'ADMIN' ? data.barbershopId : user?.barbershopId;
    if (!barbershopId) {
      throw new BadRequestException('Informe a barbearia do serviço');
    }

    return this.repository.create({
      name: data.name,
      price: data.price,
      duration: data.duration,
      barbershopId,
    });
  }

  async findAll(
    user: any,
    page = 1,
    limit = 10,
    name?: ServiceType,
    isActive?: boolean,
    barbershopId?: number
  ) {
    const normalizedPage = Math.max(Number(page) || 1, 1);
    const normalizedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const where: any = {};

    if (name) {
      where.name = name;
    }

    if (typeof isActive !== 'undefined') {
      where.isActive = isActive;
    }

    if (user?.role === 'BARBEIRO') {
      if (!user?.barbershopId) {
        throw new ForbiddenException('Usuário não pertence a uma barbearia');
      }

      where.barbershopId = user.barbershopId;

    } else if (user?.role === 'ADMIN') {
      if (barbershopId) {
        where.barbershopId = Number(barbershopId);
      }

    } else {
      if (barbershopId) {
        where.barbershopId = Number(barbershopId);
      }
      where.isActive = true;
    }


    const { rows, count } = await this.repository.findAndCountAll({
      where,
      limit: normalizedLimit,
      offset: (normalizedPage - 1) * normalizedLimit,
      order: [['id', 'ASC']],
    });

    return {
      data: rows,
      total: count,
      page: normalizedPage,
      limit: normalizedLimit,
      lastPage: Math.ceil(count / normalizedLimit),
    };
  }


  async findOne(id: number, user: any) {
    const service = user?.role === 'ADMIN' ? await this.repository.findById(id) : await this.repository.findOne({ id, barbershopId: user?.barbershopId });
    if (!service) throw new NotFoundException('Serviço não encontrado');
    return service;
  }

  async update(id: number, data: UpdateServiceDto, user: any) {
    const service = user?.role === 'ADMIN' ? await this.repository.findById(id) : await this.repository.findOne({ id, barbershopId: user?.barbershopId });
    if (!service) throw new NotFoundException('Serviço não encontrado');
    await service.update(data);
    return service;
  }

  async remove(id: number, user: any) {
    const service = user?.role === 'ADMIN' ? await this.repository.findById(id) : await this.repository.findOne({ id, barbershopId: user?.barbershopId });
    if (!service) throw new NotFoundException('Serviço não encontrado');
    await service.destroy();
    return { message: 'Serviço removido com sucesso' };
  }
}

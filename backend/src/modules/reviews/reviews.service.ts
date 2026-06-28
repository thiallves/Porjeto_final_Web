import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { CreateReviewDto } from './dto/create-reviews.dto';
import { UpdateReviewDto } from './dto/update-reviews.dto';
import { FilterReviewsDto } from './dto/filter-reviews.dto';
import { ReviewRepository } from './repositories/reviews.repository';
import { Appointment } from '../../database/models/appointment.model';

@Injectable()
export class ReviewService {
  constructor(private readonly repository: ReviewRepository) {}

  async create(data: CreateReviewDto, user: any) {
    if (user.role !== 'CLIENTE') {
      throw new ForbiddenException('Apenas clientes podem criar avaliações');
    }

    const userId = user.userId ?? user.id;

    const appointment = await Appointment.findByPk(data.appointmentId);

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (appointment.userId !== userId) {
      throw new ForbiddenException(
        'Você só pode avaliar seus próprios agendamentos',
      );
    }

    if (appointment.status !== 'CONCLUIDO') {
      throw new BadRequestException(
        'Só é possível avaliar agendamentos concluídos',
      );
    }

    return this.repository.create({
      ...data,
      userId,
    });
  }

  async findAll(filters: FilterReviewsDto = {}) {
    const page = Math.max(Number(filters.page) || 1, 1);
    const limit = Math.min(Math.max(Number(filters.limit) || 10, 1), 100);

    const where: any = {};

    if (filters.userId) {
      where.userId = Number(filters.userId);
    }

    if (filters.barbershopId) {
      where.barbershopId = Number(filters.barbershopId);
    }

    if (filters.appointmentId) {
      where.appointmentId = Number(filters.appointmentId);
    }

    if (filters.rating) {
      where.rating = Number(filters.rating);
    }

    if (filters.minRating || filters.maxRating) {
      where.rating = {};

      if (filters.minRating) {
        where.rating[Op.gte] = Number(filters.minRating);
      }

      if (filters.maxRating) {
        where.rating[Op.lte] = Number(filters.maxRating);
      }
    }

    if (filters.comment) {
      where.comment = { [Op.iLike]: `%${filters.comment}%` };
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
      throw new NotFoundException('Avaliação não encontrada');
    }

    return item;
  }

  async replace(id: number, data: CreateReviewDto) {
    const item = await this.findOne(id);
    await item.update(data);
    return item;
  }

  async update(id: number, data: UpdateReviewDto) {
    const item = await this.findOne(id);
    await item.update(data);
    return item;
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await item.destroy();

    return {
      message: 'Avaliação removida com sucesso',
    };
  }
}
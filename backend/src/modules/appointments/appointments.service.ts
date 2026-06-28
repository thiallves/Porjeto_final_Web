import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { AppointmentStatus } from '../../database/models/appointment.model';
import { UserRole } from '../../database/models/user.model';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentsRepository } from './repositories/appointments.repository';
import { ServicesRepository } from '../services/repositories/services.repository';
import { BarbershopsRepository } from '../barbershops/repositories/barbershops.repository';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly servicesRepository: ServicesRepository,
    private readonly barbershopsRepository: BarbershopsRepository,
  ) { }

  async create(dto: CreateAppointmentDto, loggedUser: any) {
    const startDate = new Date(dto.date);
    if (Number.isNaN(startDate.getTime())) throw new BadRequestException('Data inválida');
    if (startDate <= new Date()) throw new BadRequestException('Horário passado não pode ser reservado');

    const service = await this.servicesRepository.findById(dto.serviceId);
    if (!service || service.barbershopId !== dto.barbershopId) {
      throw new BadRequestException('Serviço só pode ser usado se pertence à barbearia');
    }

    const barbershop = await this.barbershopsRepository.findById(dto.barbershopId);
    if (!barbershop) throw new NotFoundException('Barbearia não encontrada');
    if (!barbershop.isActive) throw new BadRequestException('Barbearia está inativa');

    const endDate = new Date(startDate.getTime() + Number(service.duration) * 60_000);
    this.ensureInsideBusinessHours(startDate, endDate, barbershop.openingTime, barbershop.closingTime);

    const userId = loggedUser?.role === UserRole.ADMIN && dto.userId ? dto.userId : loggedUser?.userId;
    if (!userId) throw new ForbiddenException('Usuário autenticado não identificado');

    await this.ensureNoOverlap({
      userId,
      barbershopId: dto.barbershopId,
      barberId: dto.barberId,
      startDate,
      endDate,
    });

    await this.ensureDailyLimit(dto.barbershopId, startDate, barbershop.dailyAppointmentLimit);

    return this.appointmentsRepository.create({
      userId,
      serviceId: dto.serviceId,
      barbershopId: dto.barbershopId,
      barberId: dto.barberId ?? null,
      date: startDate,
      endDate,
      status: AppointmentStatus.PENDENTE,
    });
  }

  async findAll(
    loggedUser: any,
    page = 1,
    limit = 10,
    status?: string,
    barbershopId?: number,
    userId?: number,
    serviceId?: number
  ) {
    const normalizedPage = Math.max(Number(page) || 1, 1);
    const normalizedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const where: any = {};


    if (status) {
      where.status = status;
    }

    if (loggedUser?.role === UserRole.CLIENTE) {
      where.userId = loggedUser.userId;

    } else if (loggedUser?.role === UserRole.BARBEIRO) {
      if (!loggedUser.barbershopId) {
        throw new ForbiddenException('Funcionário não pertence a uma barbearia');
      }

      where.barbershopId = loggedUser.barbershopId;
    }

 
    if (barbershopId) {
      where.barbershopId = Number(barbershopId);
    }

    if (userId) {
      where.userId = Number(userId);
    }

    if (serviceId) {
      where.serviceId = Number(serviceId);
    }

    const { rows, count } =
      await this.appointmentsRepository.findAndCountAll({
        where,
        limit: normalizedLimit,
        offset: (normalizedPage - 1) * normalizedLimit,
        order: [['date', 'ASC']],
        include: [
          {
            association: 'barbershop',
            attributes: ['id', 'name', 'city'],
          },
          {
            association: 'service',
            attributes: ['id', 'name', 'price'],
          },
          {
            association: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            association: 'barber',
            attributes: ['id', 'name'],
          },
        ],
      });

    return {
      data: rows,
      total: count,
      page: normalizedPage,
      limit: normalizedLimit,
      lastPage: Math.ceil(count / normalizedLimit),
    };
  }


  async cancel(id: number, loggedUser: any) {
  const appointment = await this.appointmentsRepository.findById(id);

  if (!appointment) {
    throw new NotFoundException('Agendamento não encontrado');
  }

  if (appointment.status === AppointmentStatus.CANCELADO) {
    throw new BadRequestException('Agendamento já cancelado');
  }

  const loggedUserId = Number(loggedUser?.userId ?? loggedUser?.id);

  if (loggedUser.role === UserRole.CLIENTE) {
    if (appointment.userId !== loggedUserId) {
      throw new ForbiddenException('Você só pode cancelar seu próprio agendamento');
    }
  }

  if (loggedUser.role === UserRole.BARBEIRO) {
    const sameBarbershop =
      loggedUser.barbershopId &&
      Number(loggedUser.barbershopId) === Number(appointment.barbershopId);

    const sameBarber =
      appointment.barberId &&
      Number(appointment.barberId) === loggedUserId;

    if (!sameBarbershop && !sameBarber) {
      throw new ForbiddenException(
        'Você só pode cancelar agendamentos da sua barbearia ou vinculados a você',
      );
    }
  }

  const barbershop = await this.barbershopsRepository.findById(
    appointment.barbershopId,
  );

  if (!barbershop) {
    throw new NotFoundException('Barbearia não encontrada');
  }

  const limitMs = barbershop.cancellationLimitHours * 60 * 60 * 1000;
  const appointmentDate = new Date(appointment.date);

  if (appointmentDate.getTime() - Date.now() < limitMs) {
    throw new BadRequestException(
      `Cancelamento permitido somente até ${barbershop.cancellationLimitHours} horas antes`,
    );
  }

  await appointment.update({
    status: AppointmentStatus.CANCELADO,
  });

  return appointment;
}

async updateStatus(id: number, status: AppointmentStatus, loggedUser: any) {
  const appointment = await this.appointmentsRepository.findById(id);
  if (!appointment) {
    throw new NotFoundException('Agendamento não encontrado');
  }


  if (loggedUser.role === UserRole.CLIENTE) {

    
    if (
      status !== 'CONFIRMADO' &&
      status !== 'CANCELADO'
    ) {
      throw new ForbiddenException('Cliente não pode definir esse status');
    }


    if (appointment.userId !== loggedUser.userId) {
      throw new ForbiddenException('Acesso negado ao agendamento');
    }


    if (appointment.status !== 'PENDENTE') {
      throw new ForbiddenException('Só é possível alterar agendamentos pendentes');
    }
  }



  await appointment.update({ status });

  return appointment;
}

  private async ensureNoOverlap(input: { userId: number; barbershopId: number; barberId?: number; startDate: Date; endDate: Date }) {
    const intervalWhere = {
      status: { [Op.ne]: AppointmentStatus.CANCELADO },
      date: { [Op.lt]: input.endDate },
      endDate: { [Op.gt]: input.startDate },
    };

    const occupiedBarbershopSlot = await this.appointmentsRepository.findOne({
      ...intervalWhere,
      barbershopId: input.barbershopId,
    });
    if (occupiedBarbershopSlot) throw new BadRequestException('Horário já ocupado nessa barbearia');

    const clientConflict = await this.appointmentsRepository.findOne({
      ...intervalWhere,
      userId: input.userId,
    });
    if (clientConflict) throw new BadRequestException('Cliente não pode ter dois agendamentos no mesmo horário');

    if (input.barberId) {
      const barberConflict = await this.appointmentsRepository.findOne({
        ...intervalWhere,
        barberId: input.barberId,
      });
      if (barberConflict) throw new BadRequestException('Barbeiro já possui atendimento nesse horário');
    }
  }

  private async ensureDailyLimit(barbershopId: number, date: Date, dailyLimit: number) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const total = await this.appointmentsRepository.count({
      where: {
        barbershopId,
        status: { [Op.ne]: AppointmentStatus.CANCELADO },
        date: { [Op.between]: [startOfDay, endOfDay] },
      },
    });

    if (total >= dailyLimit) throw new BadRequestException('Limite de agendamentos por dia atingido');
  }

  private ensureInsideBusinessHours(start: Date, end: Date, openingTime: string, closingTime: string) {
    const [openHour, openMinute] = openingTime.split(':').map(Number);
    const [closeHour, closeMinute] = closingTime.split(':').map(Number);

    const opening = new Date(start);
    opening.setHours(openHour, openMinute, 0, 0);
    const closing = new Date(start);
    closing.setHours(closeHour, closeMinute, 0, 0);

    if (start < opening || end > closing) {
      throw new BadRequestException('Barbeiro só pode atender dentro do horário de funcionamento');
    }
  }
}

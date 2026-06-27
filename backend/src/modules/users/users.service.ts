import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../../database/models/user.model';
import { UsersRepository } from './repositories/users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  async create(data: CreateUserDto, loggedUser?: any) {
    const exists = await this.findByEmail(data.email);

    if (exists) {
      throw new BadRequestException('Email já cadastrado');
    }

    if (data.role === UserRole.ADMIN && loggedUser?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Somente ADMIN pode criar outro ADMIN');
    }

    if (data.role === UserRole.BARBEIRO && !data.barbershopId && !loggedUser?.barbershopId) {
      throw new BadRequestException('Barbeiro precisa estar vinculado a uma barbearia');
    }

    const hash = await bcrypt.hash(data.password, 10);

    const user = await this.usersRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role ?? UserRole.CLIENTE,
      password: hash,
      barbershopId: data.barbershopId ?? loggedUser?.barbershopId ?? null,
    });

    return this.removePassword(user.toJSON());
  }

  async findAll(user: any, page = 1, limit = 10, name?: string, role?: string, email?: string) {
    const normalizedPage = Math.max(Number(page) || 1, 1);
    const normalizedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const offset = (normalizedPage - 1) * normalizedLimit;

    const where: any = {};

    if (name) where.name = { [Op.iLike]: `%${name}%` };

    if (email) {
      where.email = { [Op.iLike]: `%${email}%` }; 
    }

    if (user.role === 'ADMIN') {
      if (role) where.role = role;

    } else if (user.role === 'CLIENTE') {
      if (role === 'BARBEIRO') {
        where.role = 'BARBEIRO';
      } else {
        throw new ForbiddenException('Cliente só pode visualizar barbeiros');
      }

    } else if (user.role === 'BARBEIRO') {
      if (role) where.role = role;
    }

    const { rows, count } = await this.usersRepository.findAndCountAll({
      where,
      limit: normalizedLimit,
      offset,
      attributes: { exclude: ['password'] },
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

  async findOne(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return this.removePassword(user.toJSON());
  }

  async update(id: number, data: UpdateUserDto, requester?: any) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (data.password) data.password = await bcrypt.hash(data.password, 10);

    if (data.role === UserRole.ADMIN && requester?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Usuário não pode se auto-promover para ADMIN');
    }

    await user.update(data);
    return this.removePassword(user.toJSON());
  }

  async remove(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    await user.destroy();
    return { message: 'Usuário removido com sucesso' };
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async updateWithPermission(targetId: number, user: any, data: UpdateUserDto) {
    if (!user) throw new ForbiddenException('Autenticação obrigatória');

    if (user.role !== UserRole.ADMIN && user.userId !== targetId) {
      throw new ForbiddenException('Você só pode editar sua própria conta');
    }

    return this.update(targetId, data, user);
  }

  async removeWithPermission(userId: number, requester: any) {
    if (!requester) throw new ForbiddenException('Autenticação obrigatória');

    if (requester.role !== UserRole.ADMIN && requester.userId !== userId) {
      throw new ForbiddenException('Você só pode excluir sua própria conta');
    }

    return this.remove(userId);
  }

  private removePassword(user: any) {
    const { password, ...result } = user;
    return result;
  }
}

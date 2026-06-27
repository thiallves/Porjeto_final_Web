import {
  Controller,
  Query,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../database/models/user.model';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) { }

  // CRIAR USUÁRIO (PÚBLICO)
  @Post()
  @ApiOperation({ summary: 'Criar usuário' })
  create(
    @Body() body: CreateUserDto,
    @Req() req: any,
  ) {
    return this.service.create(body, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CLIENTE, UserRole.BARBEIRO)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    summary: 'Listar usuários com paginação e filtros',
  })

  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'email', required: false })

  findAll(
    @Req() req: any, 
    @Query('email') email?: string) {
    return this.service.findAll(
      req.user, 
      Number(req.query.page) || 1,
      Number(req.query.limit) || 10,
      req.query.name as string,
      req.query.role as string,
      email,
    );
  }

// BUSCAR POR ID
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Get(':id')
@ApiOperation({ summary: 'Buscar usuário por ID' })
findOne(@Param('id') id: string) {
  return this.service.findOne(Number(id));
}

// ATUALIZAÇÃO COMPLETA
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Put(':id')
@ApiOperation({ summary: 'Atualizar usuário (PUT)' })
replace(
  @Param('id') id: string,
  @Body() body: CreateUserDto,
  @Req() req: any,
) {
  return this.service.updateWithPermission(
    Number(id),
    req.user,
    body,
  );
}

// ATUALIZAÇÃO PARCIAL
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Patch(':id')
@ApiOperation({ summary: 'Atualizar usuário (PATCH)' })
update(
  @Param('id') id: string,
  @Body() body: UpdateUserDto,
  @Req() req: any,
) {
  return this.service.updateWithPermission(
    Number(id),
    req.user,
    body,
  );
}

// REMOVER
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Delete(':id')
@ApiOperation({ summary: 'Remover usuário' })
remove(
  @Param('id') id: string,
  @Req() req: any,
) {
  return this.service.removeWithPermission(
    Number(id),
    req.user,
  );
}
}
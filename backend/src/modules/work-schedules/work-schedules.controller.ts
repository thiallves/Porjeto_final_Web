import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../database/models/user.model';
import { CreateWorkScheduleDto } from './dto/create-work-schedules.dto';
import { UpdateWorkScheduleDto } from './dto/update-work-schedules.dto';
import { WorkScheduleService } from './work-schedules.service';

@ApiTags('WorkSchedule')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('work-schedules')
export class WorkScheduleController {
  constructor(private readonly service: WorkScheduleService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Criar Horário de trabalho' })
  create(@Body() dto: CreateWorkScheduleDto) { return this.service.create(dto); }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Listar Horário de trabalho com filtros e paginação' })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Buscar Horário de trabalho por ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(Number(id)); }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Atualizar completamente Horário de trabalho' })
  replace(@Param('id') id: string, @Body() dto: CreateWorkScheduleDto) { return this.service.replace(Number(id), dto); }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Atualizar parcialmente Horário de trabalho' })
  update(@Param('id') id: string, @Body() dto: UpdateWorkScheduleDto) { return this.service.update(Number(id), dto); }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover Horário de trabalho' })
  remove(@Param('id') id: string) { return this.service.remove(Number(id)); }
}

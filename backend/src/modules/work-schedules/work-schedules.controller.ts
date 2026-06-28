import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../database/models/user.model';
import { CreateWorkScheduleDto } from './dto/create-work-schedules.dto';
import { UpdateWorkScheduleDto } from './dto/update-work-schedules.dto';
import { WorkScheduleService } from './work-schedules.service';
import { FilterWorkSchedulesDto } from './dto/filter-work-schedules.dto';

@ApiTags('WorkSchedule')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('work-schedules')
export class WorkScheduleController {
  constructor(private readonly service: WorkScheduleService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Criar Horário de trabalho' })
  create(@Body() dto: CreateWorkScheduleDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Listar Horário de trabalho com filtros e paginação' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'professionalId', required: false })
  @ApiQuery({ name: 'barbershopId', required: false })
  @ApiQuery({ name: 'dayOfWeek', required: false })
  @ApiQuery({ name: 'startTime', required: false })
  @ApiQuery({ name: 'endTime', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'professionalName', required: false })
  @ApiQuery({ name: 'professionalEmail', required: false })
  findAll(@Query() query: FilterWorkSchedulesDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Buscar Horário de trabalho por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Atualizar completamente Horário de trabalho' })
  replace(@Param('id') id: string, @Body() dto: CreateWorkScheduleDto) {
    return this.service.replace(Number(id), dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Atualizar parcialmente Horário de trabalho' })
  update(@Param('id') id: string, @Body() dto: UpdateWorkScheduleDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover Horário de trabalho' })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
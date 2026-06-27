import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../database/models/user.model';
import { CreateProfessionalDto } from './dto/create-professionals.dto';
import { UpdateProfessionalDto } from './dto/update-professionals.dto';
import { ProfessionalService } from './professionals.service';

@ApiTags('Professional')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('professionals')
export class ProfessionalController {
  constructor(private readonly service: ProfessionalService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Criar Profissional' })
  create(@Body() dto: CreateProfessionalDto) { return this.service.create(dto); }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Listar Profissional com filtros e paginação' })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Buscar Profissional por ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(Number(id)); }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Atualizar completamente Profissional' })
  replace(@Param('id') id: string, @Body() dto: CreateProfessionalDto) { return this.service.replace(Number(id), dto); }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Atualizar parcialmente Profissional' })
  update(@Param('id') id: string, @Body() dto: UpdateProfessionalDto) { return this.service.update(Number(id), dto); }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover Profissional' })
  remove(@Param('id') id: string) { return this.service.remove(Number(id)); }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Put,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { BarbershopsService } from './barbershops.service';
import { CreateBarbershopDto } from './dto/create-barbershop.dto';
import { FilterBarbershopDto } from './dto/filter-barbershop.dto';
import { UpdateBarbershopDto } from './dto/update-barbershop.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../database/models/user.model';

@ApiTags('Barbershops')
@Controller('barbershops')
export class BarbershopsController {
  constructor(private readonly service: BarbershopsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova barbearia - apenas ADMIN' })
  create(@Body() body: CreateBarbershopDto) {
    return this.service.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Listar barbearias com filtros e paginação' })
  findAll(@Query() query: FilterBarbershopDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar barbearia por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar completamente a barbearia - apenas ADMIN' })
  replace(
    @Param('id') id: string,
    @Body() body: CreateBarbershopDto,
  ) {
    return this.service.update(Number(id), body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar parcialmente a barbearia - apenas ADMIN' })
  update(
    @Param('id') id: string,
    @Body() body: UpdateBarbershopDto,
  ) {
    return this.service.update(Number(id), body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover barbearia - apenas ADMIN' })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}

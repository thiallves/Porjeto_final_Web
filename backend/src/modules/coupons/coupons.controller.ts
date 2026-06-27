import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../database/models/user.model';
import { CreateCouponDto } from './dto/create-coupons.dto';
import { UpdateCouponDto } from './dto/update-coupons.dto';
import { CouponService } from './coupons.service';

@ApiTags('Coupon')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('coupons')
export class CouponController {
  constructor(private readonly service: CouponService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Criar Cupom' })
  create(@Body() dto: CreateCouponDto) { return this.service.create(dto); }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Listar Cupom com filtros e paginação' })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Buscar Cupom por ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(Number(id)); }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Atualizar completamente Cupom' })
  replace(@Param('id') id: string, @Body() dto: CreateCouponDto) { return this.service.replace(Number(id), dto); }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Atualizar parcialmente Cupom' })
  update(@Param('id') id: string, @Body() dto: UpdateCouponDto) { return this.service.update(Number(id), dto); }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover Cupom' })
  remove(@Param('id') id: string) { return this.service.remove(Number(id)); }
}

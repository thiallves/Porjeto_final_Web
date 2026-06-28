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
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { ProductService } from './products.service';
import { FilterProductsDto } from './dto/filter-products.dto';

@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Criar Produto' })
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Listar Produto com filtros e paginação' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'description', required: false })
  @ApiQuery({ name: 'barbershopId', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'minStock', required: false })
  @ApiQuery({ name: 'maxStock', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  findAll(@Query() query: FilterProductsDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Buscar Produto por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Atualizar completamente Produto' })
  replace(@Param('id') id: string, @Body() dto: CreateProductDto) {
    return this.service.replace(Number(id), dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Atualizar parcialmente Produto' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover Produto' })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
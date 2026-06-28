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
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-categories.dto';
import { CategoryService } from './categories.service';
import { FilterCategoriesDto } from './dto/filter-categories.dto';

@ApiTags('Category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Criar Categoria' })
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Listar Categoria com filtros e paginação' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'description', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  findAll(@Query() query: FilterCategoriesDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Buscar Categoria por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Atualizar completamente Categoria' })
  replace(@Param('id') id: string, @Body() dto: CreateCategoryDto) {
    return this.service.replace(Number(id), dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Atualizar parcialmente Categoria' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover Categoria' })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
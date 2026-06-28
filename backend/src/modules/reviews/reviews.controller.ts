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
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../database/models/user.model';
import { CreateReviewDto } from './dto/create-reviews.dto';
import { UpdateReviewDto } from './dto/update-reviews.dto';
import { ReviewService } from './reviews.service';
import { FilterReviewsDto } from './dto/filter-reviews.dto';

@ApiTags('Review')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reviews')
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Post()
  @Roles(UserRole.CLIENTE)
  @ApiOperation({ summary: 'Criar Avaliação' })
  create(@Body() dto: CreateReviewDto, @Req() req: any) {
    return this.service.create(dto, req.user);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Listar Avaliação com filtros e paginação' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'barbershopId', required: false })
  @ApiQuery({ name: 'appointmentId', required: false })
  @ApiQuery({ name: 'rating', required: false })
  @ApiQuery({ name: 'minRating', required: false })
  @ApiQuery({ name: 'maxRating', required: false })
  @ApiQuery({ name: 'comment', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  findAll(@Query() query: FilterReviewsDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Buscar Avaliação por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Atualizar completamente Avaliação' })
  replace(@Param('id') id: string, @Body() dto: CreateReviewDto) {
    return this.service.replace(Number(id), dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.BARBEIRO)
  @ApiOperation({ summary: 'Atualizar parcialmente Avaliação' })
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover Avaliação' })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
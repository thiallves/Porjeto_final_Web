import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly service: ServicesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar serviço para a barbearia do usuário autenticado' })
  create(@Body() data: CreateServiceDto, @Req() req: any) {
    return this.service.create(data, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar serviços com paginação e filtros' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    example: 'Corte navalhado',
  })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'barbershopId', required: false })
  findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
    @Query('isActive') isActive?: string,
    @Query('barbershopId') barbershopId?: string,
  ) {
    const activeFilter =
      isActive === undefined ? undefined : isActive === 'true';

    const parsedBarbershopId =
      barbershopId !== undefined ? Number(barbershopId) : undefined;

    return this.service.findAll(
      req.user,
      Number(page) || 1,
      Number(limit) || 10,
      name,
      activeFilter,
      parsedBarbershopId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar serviço por ID' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.service.findOne(Number(id), req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar serviço' })
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto, @Req() req: any) {
    return this.service.update(Number(id), dto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover serviço' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(Number(id), req.user);
  }
}
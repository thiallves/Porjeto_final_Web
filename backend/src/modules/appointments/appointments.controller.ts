import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentStatus } from '../../database/models/appointment.model';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) { }

  @Post()
  @ApiOperation({ summary: 'Criar agendamento aplicando regras de negócio' })
  create(@Body() dto: CreateAppointmentDto, @Req() req: any) {
    return this.service.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar agendamentos com paginação e filtros' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false, enum: AppointmentStatus })
  @ApiQuery({ name: 'barbershopId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'serviceId', required: false }) 

  findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('barbershopId') barbershopId?: string, 
    @Query('userId') userId?: string,             
    @Query('serviceId') serviceId?: string        
  ) {
    return this.service.findAll(
      req.user,
      Number(page) || 1,
      Number(limit) || 10,
      status,

      barbershopId ? Number(barbershopId) : undefined, 
      userId ? Number(userId) : undefined,             
      serviceId ? Number(serviceId) : undefined        
    );
  }


  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar agendamento respeitando limite de horas antes' })
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.service.cancel(Number(id), req.user);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Alterar status do agendamento' })
  updateStatus(@Param('id') id: string, @Body('status') status: AppointmentStatus, @Req() req: any) {
    return this.service.updateStatus(Number(id), status, req.user);
  }
}

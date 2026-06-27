import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Service } from './service.model';
import { Barbershop } from './barbershop.model';

export enum AppointmentStatus {
  PENDENTE = 'PENDENTE',
  CONFIRMADO = 'CONFIRMADO',
  CANCELADO = 'CANCELADO',
  CONCLUIDO = 'CONCLUIDO',
}

@Table({ tableName: 'appointments', timestamps: true })
export class Appointment extends Model<Appointment> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @BelongsTo(() => User, 'userId')
  declare user: User;

  @ForeignKey(() => User) 
  @Column({ type: DataType.INTEGER, allowNull: true }) declare barberId: number | null;
  
  @BelongsTo(() => User, 'barberId') declare barber: User;

  @ForeignKey(() => Service)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare serviceId: number;

  @BelongsTo(() => Service)
  declare service: Service;

  @ForeignKey(() => Barbershop)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare barbershopId: number;

  @BelongsTo(() => Barbershop)
  declare barbershop: Barbershop;

  @Column({ type: DataType.DATE, allowNull: false })
  declare date: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  declare endDate: Date;

  @Column({
    type: DataType.ENUM(...Object.values(AppointmentStatus)),
    allowNull: false,
    defaultValue: AppointmentStatus.PENDENTE,
  })
  declare status: AppointmentStatus;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

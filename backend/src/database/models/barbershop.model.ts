import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Service } from './service.model';
import { Appointment } from './appointment.model';
import { User } from './user.model';

export interface BarbershopAttributes {
  id?: number;
  name: string;
  address: string;
  city: string;
  neighborhood: string;
  latitude?: number | null;
  longitude?: number | null;
  openingTime: string;
  closingTime: string;
  cancellationLimitHours: number;
  dailyAppointmentLimit: number;
  isActive: boolean;
}

@Table({ tableName: 'barbershops', timestamps: true })
export class Barbershop extends Model<BarbershopAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare address: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare city: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare neighborhood: string;

  @Column({ type: DataType.FLOAT, allowNull: true })
  declare latitude: number | null;

  @Column({ type: DataType.FLOAT, allowNull: true })
  declare longitude: number | null;

  @Column({ type: DataType.TIME, allowNull: false, defaultValue: '08:00:00' })
  declare openingTime: string;

  @Column({ type: DataType.TIME, allowNull: false, defaultValue: '18:00:00' })
  declare closingTime: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 2 })
  declare cancellationLimitHours: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 30 })
  declare dailyAppointmentLimit: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @HasMany(() => Service)
  declare services: Service[];

  @HasMany(() => Appointment)
  declare appointments: Appointment[];

  @HasMany(() => User)
  declare users: User[];

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

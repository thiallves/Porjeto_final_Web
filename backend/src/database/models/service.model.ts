import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { Barbershop } from './barbershop.model';
import { Appointment } from './appointment.model';

export enum ServiceType {
  CORTE_MAQUINA = 'CORTE_MAQUINA',
  CORTE_TESOURA = 'CORTE_TESOURA',
  BARBA = 'BARBA',
}

export interface ServiceAttributes {
  id?: number;
  name: ServiceType;
  price: number;
  duration: number;
  barbershopId: number;
  isActive?: boolean;
}

export interface ServiceCreationAttributes extends Omit<ServiceAttributes, 'id'> {}

@Table({ tableName: 'services', timestamps: true })
export class Service extends Model<ServiceAttributes, ServiceCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.ENUM(...Object.values(ServiceType)), allowNull: false })
  declare name: ServiceType;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare duration: number;

  @ForeignKey(() => Barbershop)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare barbershopId: number;

  @BelongsTo(() => Barbershop)
  declare barbershop: Barbershop;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @HasMany(() => Appointment)
  declare appointments: Appointment[];

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

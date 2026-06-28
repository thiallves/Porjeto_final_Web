import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey
} from 'sequelize-typescript';

import { Professional } from './professional.model';
import { Barbershop } from './barbershop.model';


@Table({ tableName: 'work_schedules', timestamps: true })
export class WorkSchedule extends Model<WorkSchedule> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Professional)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare professionalId: number;

  @ForeignKey(() => Barbershop)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare barbershopId: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare dayOfWeek: number;

  @Column({ type: DataType.TIME, allowNull: true })
  declare startTime: string;

  @Column({ type: DataType.TIME, allowNull: true })
  declare endTime: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  declare isActive: boolean;

  @BelongsTo(() => Professional)
  professional: Professional;

  @BelongsTo(() => Barbershop)
  barbershop: Barbershop;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

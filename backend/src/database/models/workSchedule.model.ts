import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'work_schedules', timestamps: true })
export class WorkSchedule extends Model<WorkSchedule> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare professionalId: any;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare barbershopId: any;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare dayOfWeek: any;

  @Column({ type: DataType.TIME, allowNull: true })
  declare startTime: any;

  @Column({ type: DataType.TIME, allowNull: true })
  declare endTime: any;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  declare isActive: any;


  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

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

@Table({ tableName: 'professionals', timestamps: true })
export class Professional extends Model<Professional> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare name: any;

  @Column({ type: DataType.STRING, allowNull: true })
  declare email: any;

  @Column({ type: DataType.STRING, allowNull: true })
  declare phone: any;

  @Column({ type: DataType.STRING, allowNull: true })
  declare specialty: any;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare barbershopId: any;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  declare isActive: any;


  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

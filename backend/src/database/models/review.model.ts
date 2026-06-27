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

@Table({ tableName: 'reviews', timestamps: true })
export class Review extends Model<Review> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare userId: any;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare barbershopId: any;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare appointmentId: any;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 5 })
  declare rating: any;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare comment: any;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  declare isActive: any;


  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

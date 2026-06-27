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

@Table({ tableName: 'coupons', timestamps: true })
export class Coupon extends Model<Coupon> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare code: any;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: any;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare discountPercent: any;

  @Column({ type: DataType.DATE, allowNull: true })
  declare expiresAt: any;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  declare isActive: any;


  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

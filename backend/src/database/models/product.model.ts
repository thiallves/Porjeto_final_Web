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

@Table({ tableName: 'products', timestamps: true })
export class Product extends Model<Product> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare name: any;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: any;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  declare price: any;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare stock: any;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare barbershopId: any;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  declare isActive: any;


  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

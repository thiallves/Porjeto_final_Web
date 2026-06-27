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

export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENTE = 'CLIENTE',
  BARBEIRO = 'BARBEIRO',
}

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  barbershopId?: number | null;
  isActive?: boolean;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {}

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare phone: string;

  @ForeignKey(() => Barbershop)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare barbershopId: number | null;

  @BelongsTo(() => Barbershop)
  declare barbershop: Barbershop;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.CLIENTE,
  })
  declare role: UserRole;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @HasMany(() => Appointment, 'userId')
  declare appointments: Appointment[];

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

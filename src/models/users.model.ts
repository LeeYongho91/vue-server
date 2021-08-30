import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { User } from '@/interfaces/user/users.interface';

export type UserCreationAttributes = Optional<User, 'seq' | 'uuid' | 'email' | 'nickname' | 'password' | 'login_type'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  public seq: number;
  public uuid: string;
  public email: string;
  public nickname: string;
  public password: string;
  public login_type: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      seq: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      nickname: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      login_type: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: 'user_list',
      sequelize,
    }
  );

  return UserModel;
}

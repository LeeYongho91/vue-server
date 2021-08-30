import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Qa } from '@/interfaces/shop/qa.interface';

export type QaAttributes = Optional<Qa, 'seq' | 'product_id' | 'nickname' | 'title' | 'content' | 'public_flag' | 'password' | 'answer_flag'>;

export class QaModel extends Model<Qa, QaAttributes> implements Qa {
  public seq: number;
  public product_id: number;
  public nickname: string;
  public title: string;
  public content: string;
  public public_flag: boolean;
  public password: string;
  public answer_flag: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof QaModel {
  QaModel.init(
    {
      seq: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      product_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      nickname: {
        allowNull: false,
        type: DataTypes.STRING(64),
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING(1024),
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING(1024),
      },
      public_flag: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(128),
      },
      answer_flag: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: 'product_qa',
      sequelize,
    }
  );

  return QaModel;
}

import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { QaAnswer } from '@/interfaces/shop/qa_answer.interface';

export type QaAttributes = Optional<QaAnswer, 'seq' | 'product_id' | 'qa_id' | 'content'>;

export class QaAnswerModel extends Model<QaAnswer, QaAttributes> implements QaAnswer {
  public seq: number;
  public product_id: number;
  public qa_id: number;
  public content: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof QaAnswerModel {
  QaAnswerModel.init(
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
      qa_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING(1024),
      },
    },
    {
      tableName: 'product_qa_answer',
      sequelize,
    }
  );

  return QaAnswerModel;
}

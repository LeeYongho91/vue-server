import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Review } from '@/interfaces/shop/review.interface';

export type ReviewAttributes = Optional<Review, 'seq' | 'product_id' | 'nickname' | 'title' | 'content' | 'star'>;

export class test2 extends Model<Review, ReviewAttributes> implements Review {
  public seq: number;
  public product_id: number;
  public nickname: string;
  public title: string;
  public content: string;
  public star: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof test2 {
  test2.init(
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
      star: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'test2',
      sequelize,
    }
  );

  return test2;
}

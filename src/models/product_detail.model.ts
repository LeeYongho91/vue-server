import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { productDetail } from '@/interfaces/shop/product_detail.interface';

export type ProductDetailAttributes = Optional<productDetail, 'seq' | 'product_id' | 'description' | 'stock'>;

export class ProductDetailModel extends Model<productDetail, ProductDetailAttributes> implements productDetail {
  public seq: number;
  public product_id: number;
  public description: string;
  public stock: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof ProductDetailModel {
  ProductDetailModel.init(
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
      description: {
        allowNull: false,
        type: DataTypes.STRING(512),
      },
      stock: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'product_detail',
      sequelize,
    }
  );

  return ProductDetailModel;
}

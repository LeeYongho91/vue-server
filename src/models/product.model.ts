import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Product } from '@/interfaces/shop/product.interface';

export type ProductAttributes = Optional<Product, 'seq' | 'product_type' | 'name' | 'price' | 'img'>;

export class ProductModel extends Model<Product, ProductAttributes> implements Product {
  public seq: number;
  public product_type: string;
  public name: string;
  public price: number;
  public img: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof ProductModel {
  ProductModel.init(
    {
      seq: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      product_type: {
        allowNull: false,
        type: DataTypes.STRING(8),
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(64),
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      img: {
        allowNull: false,
        type: DataTypes.STRING(64),
      },
    },
    {
      tableName: 'product_list',
      sequelize,
    }
  );

  return ProductModel;
}

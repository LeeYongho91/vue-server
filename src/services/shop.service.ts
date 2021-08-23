import DB from '@databases/index';
import HttpException from '@exceptions/HttpException';
import { Product } from '@interfaces/product.interface';
import { isEmpty } from '@utils/util';

class ShopService {
  public products = DB.Products;

  public async findAllProduct(type): Promise<Product[]> {
    if (isEmpty(type)) throw new HttpException(400, 'wrong type');

    const allProduct: Product[] = await this.products.findAll({ where: { product_type: type } });
    return allProduct;
  }
}

export default ShopService;

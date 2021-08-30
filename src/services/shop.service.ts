import DB from '@databases/index';
import HttpException from '@exceptions/HttpException';
import { Product } from '@/interfaces/shop/product.interface';
import { isEmpty } from '@utils/util';

class ShopService {
  public products = DB.Products;
  public ProductDetail = DB.ProductDetail;

  /**
   *
   * @param params
   * @returns
   */
  public async findAllProduct(params): Promise<Product[]> {
    if (isEmpty(params)) throw new HttpException(400, 'wrong params');

    const page = params.page;
    const list = params.list;
    const type = params.type;

    const start = (page - 1) * list;

    const end = list;

    const allProduct: Product[] = await this.products.findAll({ where: { product_type: type }, limit: end, offset: start });
    return allProduct;
  }

  /**
   *
   * @param params
   * @returns
   */
  public async findAllProductCount(params): Promise<number> {
    const allProductCount: number = await this.products.count({ where: { product_type: params.type } });
    return allProductCount;
  }

  /**
   *
   * @param id
   * @returns
   */
  public async getProductsById(id): Promise<Product> {
    if (isEmpty(id)) throw new HttpException(400, 'wrong id');

    const product = await this.products.findOne({
      where: { seq: id },
      // include: [
      //   {
      //     model: this.ProductDetail,
      //   },
      // ],
    });

    return product;
  }
}

export default ShopService;

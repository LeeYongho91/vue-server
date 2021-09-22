import DB from '@databases/index';
import HttpException from '@exceptions/HttpException';
import { Product } from '@/interfaces/shop/product.interface';
import { Qa } from '@/interfaces/shop/qa.interface';
import { QaAnswer } from '@/interfaces/shop/qa_answer.interface';
import { Review } from '@/interfaces/shop/review.interface';
import { pagination } from '@/utils/pagination';
import { isEmpty } from '@utils/util';

class ShopService {
  public products = DB.Products;
  public ProductDetail = DB.ProductDetail;
  public ProductQa = DB.ProductQa;
  public ProductQaAnswer = DB.ProductQaAnswer;
  public ProductReview = DB.ProductReview;

  public pagination = pagination;

  /**
   *
   * @param params
   * @returns
   */
  public async findAllProduct(params: object): Promise<Product[]> {
    if (isEmpty(params)) throw new HttpException(400, 'wrong params');

    const page: number = params['page'];
    const list: number = params['list'];
    const type: number = params['type'];

    const [start, end] = this.pagination(page, list);

    const allProduct: Product[] = await this.products.findAll({ where: { product_type: type }, limit: end, offset: start });
    return allProduct;
  }

  /**
   *
   * @param params
   * @returns
   */
  public async findAllProductCount(params: object): Promise<number> {
    const allProductCount: number = await this.products.count({ where: { product_type: params['type'] } });
    return allProductCount;
  }

  /**
   *
   * @param id
   * @returns
   */
  public async getProductsById(id: number): Promise<object> {
    if (isEmpty(id)) throw new HttpException(400, 'wrong id');

    const product = await this.products.findByPk(id);
    const product_id = product.seq;
    const product_detail = await this.ProductDetail.findOne({ where: { product_id } });

    const result = [product, product_detail];

    return result;
  }

  /**
   *
   * @returns
   */
  public async getLikeProducts() {
    const allProduct: Product[] = await this.products.findAll();

    const allProductCount: number = allProduct.length;
    const randValues: number[] = this.getRandomValues(allProductCount);

    const result = [];

    for (const n of randValues) {
      const product = allProduct.find((e) => e.seq == n);
      result.push(product);
    }

    return result;
  }

  /**
   *
   * @param data
   * @returns
   */
  public async postProductQa(data: object): Promise<Qa> {
    if (isEmpty(data)) throw new HttpException(400, "You're not qaData");

    const result: Qa = await this.ProductQa.create({ ...data });

    return result;
  }

  /**
   *
   * @param data
   * @returns
   */
  public async getProductQa(data: object): Promise<Qa[]> {
    if (isEmpty(data)) throw new HttpException(400, 'wrong data');

    const product_id = data['id'];
    const page = data['page'];
    const list = data['list'];

    const [start, end] = this.pagination(page, list);

    const result: Qa[] = await this.ProductQa.findAll({ where: { product_id }, limit: end, offset: start });

    return result;
  }

  /**
   *
   * @param data
   * @returns
   */
  public async getProductQaAnswer(data: object): Promise<QaAnswer[]> {
    if (isEmpty(data)) throw new HttpException(400, 'wrong data');

    const product_id = data['id'];
    const page = data['page'];
    const list = data['list'];

    const [start, end] = this.pagination(page, list);

    const result: QaAnswer[] = await this.ProductQaAnswer.findAll({ where: { product_id }, limit: end, offset: start });

    return result;
  }

  /**
   *
   * @param data
   * @returns
   */
  public async getProductQaCount(data: object): Promise<number> {
    const product_id = data['id'];

    const allProductCount: number = await this.ProductQa.count({ where: { product_id } });
    return allProductCount;
  }

  /**
   *
   * @param data
   * @returns
   */
  public async getProductReview(data: object): Promise<Review[]> {
    if (isEmpty(data)) throw new HttpException(400, 'wrong data');

    const product_id = data['id'];
    const page = data['page'];
    const list = data['list'];

    const [start, end] = this.pagination(page, list);

    const result: Review[] = await this.ProductReview.findAll({ where: { product_id }, limit: end, offset: start });

    return result;
  }

  /**
   *
   * @param params
   * @returns
   */
  public async getProductReviewCount(data: object): Promise<number> {
    const product_id = data['id'];
    const allProductReviewCount: number = await this.ProductReview.count({ where: { product_id } });
    return allProductReviewCount;
  }

  /**
   *
   * @param data
   * @returns
   */
  public async postProductReview(data: object): Promise<Review> {
    if (isEmpty(data)) throw new HttpException(400, "You're not data");

    const allProductReview: Review = await this.ProductReview.create({ ...data });

    return allProductReview;
  }

  /**
   *
   * @param product_id
   * @returns
   */
  public async getProductReviewInfo(product_id: number): Promise<Object> {
    if (isEmpty(product_id)) throw new HttpException(400, "You're not product_id");

    const allProductReview: Review[] = await this.ProductReview.findAll({ where: { product_id } });
    const [avg, count] = this.getReviewAvg(allProductReview);

    const reviewAvg: number = avg;
    const reviewCount: number = count;

    return { reviewAvg, reviewCount };
  }

  /**
   *
   * @param count
   * @returns
   */
  public getRandomValues(count: number): Array<number> {
    const randArr = [];
    while (randArr.length < 4) {
      const rand = Math.floor(Math.random() * count) + 1;
      if (randArr.indexOf(rand) === -1) {
        randArr.push(rand);
      }
    }
    return randArr;
  }

  /**
   *
   * @param reviews
   * @returns
   */
  public getReviewAvg(reviews: Array<Review>): Array<number> {
    const result = reviews.reduce((acc, cur) => {
      return acc + cur.star;
    }, 0);
    const avg: number = Math.floor(result / reviews.length);
    const count: number = reviews.length;
    return [avg, count];
  }
}

export default ShopService;

import { NextFunction, Request, Response } from 'express';
import { Product } from '@/interfaces/shop/product.interface';
import { Qa } from '@/interfaces/shop/qa.interface';
import { QaAnswer } from '@/interfaces/shop/qa_answer.interface';
import { Review } from '@/interfaces/shop/review.interface';
import shopService from '@services/shop.service';

class ShopController {
  public shopService = new shopService();

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.params.params;
      const findAllProduct: Product[] = await this.shopService.findAllProduct(JSON.parse(params));
      const findAllProductCount: number = await this.shopService.findAllProductCount(JSON.parse(params));

      res.status(200).json({ products: findAllProduct, count: findAllProductCount, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public getProductsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.body.id;
      const findOneProduct = await this.shopService.getProductsById(id);
      const reviewInfo = await this.shopService.getProductReviewInfo(id);

      res.status(200).json({ product: findOneProduct, reviewInfo, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public getLikeProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const Products: Array<number> = await this.shopService.getLikeProducts();

      res.status(200).json({ Products, message: 'getLikeProducts' });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public postProductQa = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const result: Qa = await this.shopService.postProductQa(data);
      res.status(200).json({ result, message: 'postProductQa' });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public getProductQa = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const qaList: Qa[] = await this.shopService.getProductQa(data);
      const qaAnswerList: QaAnswer[] = await this.shopService.getProductQaAnswer(data);

      const qaListCount: Number = await this.shopService.getProductQaCount(data);

      res.status(200).json({ qaList, qaAnswerList, count: qaListCount, message: 'getProductQa' });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public getProductReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const reviewList: Review[] = await this.shopService.getProductReview(data);
      const reviewListCount: Number = await this.shopService.getProductReviewCount(data);

      res.status(200).json({ reviewList, count: reviewListCount, message: 'getProductReview' });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public postProductReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const result: Review = await this.shopService.postProductReview(data);

      res.status(200).json({ result, message: 'postProductReview' });
    } catch (error) {
      next(error);
    }
  };
}

export default ShopController;

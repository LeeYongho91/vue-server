import { NextFunction, Request, Response } from 'express';
import { Product } from '@/interfaces/shop/product.interface';
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

  public getProductsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.body.id;
      const findOneProduct = await this.shopService.getProductsById(id);

      console.log(findOneProduct);

      res.status(200).json({ product: findOneProduct, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };
}

export default ShopController;

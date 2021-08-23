import { NextFunction, Request, Response } from 'express';
import { Product } from '@interfaces/product.interface';
import shopService from '@services/shop.service';

class ShopController {
  public shopService = new shopService();

  public getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const type = req.params.type;

      const findAllProduct: Product[] = await this.shopService.findAllProduct(type);

      res.status(200).json({ products: findAllProduct, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public test = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
}

export default ShopController;

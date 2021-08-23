import { Router } from 'express';
import ShopController from '@controllers/shop.controller';

import Route from '@interfaces/routes.interface';

class ShopRoute implements Route {
  public path = '/shop';
  public router = Router();
  public ShopController = new ShopController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:type`, this.ShopController.getProducts);
  }
}

export default ShopRoute;

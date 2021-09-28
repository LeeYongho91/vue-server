import config from 'config';
import Sequelize from 'sequelize';
import { dbConfig } from '@/interfaces/db/db.interface';
import UserModel from '@models/users.model';
import ProductModel from '@models/product.model';
import ProductDetailModel from '@models/product_detail.model';
import QaModel from '@models/qa.model';
import QaAnswerModel from '@models/qa_answer.model';
import ReviewModel from '@models/review.model';

import { logger } from '@utils/logger';

const { host, user, password, database, pool }: dbConfig = config.get('dbConfig');
const sequelize = new Sequelize.Sequelize(database, user, password, {
  host: host,
  dialect: 'mysql',
  timezone: '+09:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    min: pool.min,
    max: pool.max,
  },
  logQueryParameters: process.env.NODE_ENV === 'development',
  logging: (query, time) => {
    // logger.info(String(time) + 'ms' + ' ' + query);
  },
  benchmark: true,
});

void sequelize.authenticate();

const DB = {
  Users: UserModel(sequelize),
  Products: ProductModel(sequelize),
  ProductDetail: ProductDetailModel(sequelize),
  ProductQa: QaModel(sequelize),
  ProductQaAnswer: QaAnswerModel(sequelize),
  ProductReview: ReviewModel(sequelize),

  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};

export default DB;

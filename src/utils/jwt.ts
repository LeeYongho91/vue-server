import jwt from 'jsonwebtoken';
import { User } from '@/interfaces/user/users.interface';
import { DataStoredInToken, TokenData } from '@/interfaces/auth/auth.interface';
import config from 'config';

export const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { seq: user.seq };
  const secretKey: string = config.get('secretKey');
  const expiresIn: number = 60 * 60 * 48;

  return { expiresIn, token: jwt.sign(dataStoredInToken, secretKey, { expiresIn }) };
};

export const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

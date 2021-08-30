import { Request } from 'express';
import { User } from '@/interfaces/user/users.interface';

export interface DataStoredInToken {
  seq: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}

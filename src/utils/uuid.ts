import { v1 } from 'uuid';

export const uuid1 = () => {
  const tokens = v1().split('-');
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
};

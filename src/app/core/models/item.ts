import { User } from './user';


export interface Item {
  id: number;
  name: string;
  description: string;
  itemCondition: string;
  availability: boolean;
  price: number;
  owner: User;

}

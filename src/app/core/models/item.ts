import { User } from '../../core/models/user.model'; 


export interface Item {
  id: number;
  name: string;
  description: string;
  itemCondition: string;
  availability: boolean;
  price: number;
  owner: User;
}

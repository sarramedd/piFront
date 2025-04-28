import { User } from '../../core/models/user.model';
import { Discount } from './discount';


export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  discount?: Discount; // Référence à l'entité Discount
  availability: boolean;
  owner: User;
  photo: string;
  image: string;
  itemCondition: string;
  status: string;
  createdDate?: string;
  updatedDate?: string;
  category?: string;
  statusItem?: string;
  categoryType?: string;
  //itemCondition: string;
  //owner: User;

}

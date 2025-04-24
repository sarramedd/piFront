import { User } from '../../core/models/user.model';
import { Discount } from './discount';


export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  discount?: Discount; // Référence à l'entité Discount
  availability: boolean;
  owner: any; // Tu peux détailler cette partie si nécessaire
  //itemCondition: string;
  //owner: User;

}

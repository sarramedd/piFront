import { User } from '../../core/models/user.model'; 
import { Category } from './category';
import { Feedback } from './feedback';


export interface Item {
  id: number;
  name: string;
  description: string;
  itemCondition: string;
  availability: boolean;
  price: number;
  owner?: User;
  category?: Category;
  feedbacks?: Feedback[];

}

import { Item } from "./item";
import { User } from "./user.model";

export interface Commande {
    id: number;
    itemId: number;
    item: Item;
    borrowerId: number;
    user:{
      id: number;
      name: string;
      email: string;
      phone: string;
      address: string;};

    description: string;
    totalPrice: number;
    status: 'EN_ATTENTE' | 'CONFIRMER' | 'REJETER';
    createdDate: string;
    updatedDate?: string;
}
  
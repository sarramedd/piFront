import { Item } from "./item";
import { User } from "./user.model";

export interface Commande {
    id?: number;
    itemId: number;
    item: Item;
    borrowerId: number;
    borrower: User;
    description: string;
    totalPrice: number;
    status: 'EN_ATTENTE' | 'CONFIRMER' | 'REJETER';
    createdDate: string;
    updatedDate?: string;
}
  
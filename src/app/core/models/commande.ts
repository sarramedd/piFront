import { Item } from "./item";

export interface Commande {
    id?: number;
    itemId: number;
    item: Item | null;
    borrowerId: number;
    description: string;
    totalPrice: number;
    status: string;
    createdDate?: string;
}
  
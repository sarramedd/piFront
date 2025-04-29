import { Item } from "./item";

export interface Discount {
    id: number;
    name: string | null;
    code: string | null;
    percentage: number;
    startDate: string | null;
    endDate: string | null;
    active: boolean;
    item_id: number | null;
    commandes: any | null;
} 
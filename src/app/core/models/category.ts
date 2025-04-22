import { Item } from "./item";


export type CategoryType = 'ELECTRONICS' | 'FURNITURE' | 'CLOTHING' | 'BOOKS' | 'OTHER';

export interface Category {
  id?: number;
  image?: string | ArrayBuffer | null; // will store base64 or binary
  name: string;
  description: string;
  items?: Item[];
}

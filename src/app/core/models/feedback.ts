import { Item } from "./item";
import { Reacts } from "./reacts";
import { User } from "./user.model";



export interface Feedback {
  id?: number;
  message: string;
  date: string;
 // item?: { id: number }; // au lieu de Item complet
  reacts?: Reacts[];
  showReacts?: boolean; // Ajouté pour usage UI
  reported?: boolean;
  reason?:string;
  showReason?: boolean;
  user?: User;
  
}

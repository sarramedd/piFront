import { Item } from "./item";
import { Reacts } from "./reacts";
import { User } from "./user.model";



export interface Feedback {
  id?: number;
  message: string;
  date: string;
  reacts?: Reacts[];
  showReacts?: boolean;
  reported?: boolean;
  reason?: string;
  showReason?: boolean;
  user?: {
    id?: number;
    name?: string;
    email?: string;
    avatar?: string; // Add if you have user avatars
    // Add other user properties as needed
  };
  
  // Optional: If you want direct access to user properties
  userId?: number;
  userName?: string;
  userEmail?: string;
}

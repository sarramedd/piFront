import { Item } from "./item";
import { Reaction, Reacts } from "./reacts";
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
  currentUserReaction?: Reaction | null;
  suggestedReaction?: Reaction;
  sentimentScore?: number | null ;
  
  // Optional: If you want direct access to user properties
  userId?: number;
  userName?: string;
  userEmail?: string;
}

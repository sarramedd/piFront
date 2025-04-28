import { Item } from "./item";
import { Reaction, Reacts } from "./reacts";
import { User } from "./user.model";



export interface Feedback {
  id?: number;
  message: string;
  date: string;
  reacts?: Reacts[];
  reactTypes?: string[];
  showReacts?: boolean;
  reported?: boolean;
  reason?: string;
  reportReason?: string;
  showReason?: boolean;
  user?: {
    id?: number;
    name?: string;
    email?: string;
    avatar?: string; // Ensure this is here
    image?: string; // Add this as an alternative
  };
  currentUserReaction?: Reaction | null;
  suggestedReaction?: Reaction;
  sentimentScore?: number | null;
  userId?: number;
  userName?: string;
  userEmail?: string;
  userAvatar?: string; // Add this to match DTO
}

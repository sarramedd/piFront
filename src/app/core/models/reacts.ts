import { Feedback } from "./feedback";
import { User } from "./user.model";


export type Reaction = 'LIKE' | 'DISLIKE' | 'LOVE' | 'LAUGH' | 'SAD' | 'ANGRY';

export interface Reacts {
  id?: number;
  reaction: Reaction;
  date?: string;
  user?: {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    genre?: string;
    cin?: number;
  };
  feedback?: Feedback;
}

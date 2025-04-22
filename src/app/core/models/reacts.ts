import { Feedback } from "./feedback";
import { User } from "./user.model";


export type Reaction = 'LIKE' | 'DISLIKE' | 'LOVE' | 'LAUGH' | 'SAD' | 'ANGRY';

export interface Reacts {
  id?: number;
  reaction: Reaction;
  date?: string;
  user?: User;
  feedback?: Feedback;
}

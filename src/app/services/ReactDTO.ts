// react-dto.ts
export interface ReactDTO {
  id: number;
  reaction: string;
  date: string;
  userId: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  userAvatar?: string;
  userGenre: string;
  userCin: number;
  feedbackId: number;
}
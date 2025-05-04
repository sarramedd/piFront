interface ReactResponseDTO {
    id: number;
    reaction: string;
    date: string;
    userId: number;
    userName?: string;
    userEmail?: string;
    userPhone?: string;
    userAvatar?: string;  // This is the correct field name from backend
    userGenre?: string;
    userCin?: number;
    feedbackId?: number;
  }
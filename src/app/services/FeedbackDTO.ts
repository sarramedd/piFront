import { ReactDTO } from "./ReactDTO";


export interface FeedbackDTO {
    id?: number;
    message: string;
    date: string;
    reactTypes?: string[];
    userId?: number;
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
    reportReason?: string;
    isReported?: boolean;
    sentimentScore?: number | null;
    reacts?: ReactDTO// Now properly typed
}
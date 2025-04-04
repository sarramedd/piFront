import { User } from "./user";

export interface Contract {
    id: number;
    startDate: Date;
    endDate: Date;
    terms: string;
    ownerSignature: string;
    borrowerSignature: string;
    borrower: User;
    owner: User;
    details:string;
   // item: Item;
   // payment: Payment;
  }
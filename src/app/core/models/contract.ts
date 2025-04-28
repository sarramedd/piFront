  import { User } from '../../core/models/user.model'; 
  import { Payment } from './payment';

  export interface Contract {
      id: number;
      startDate: Date;
      endDate: Date;
      terms: string;
      ownerSignature: string;
      borrowerSignature: string;
      borrower: User;
      owner: {
        id: number;
        name: string;
        email: string;
        phone: string;
        address: string;
        // autres attributs utilisateur
      };
      details:string;
    // item: Item;
      //payment: Payment;
    }
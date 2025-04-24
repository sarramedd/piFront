export interface Commande {
    id: number;
    createdDate: Date;
    description: string | null;
    status: string;
    totalPrice: number;
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      address: string;
      // autres attributs utilisateur
    };
    item: {  // C'est ici que tu inclues l'item associé à la commande
      id: number;
      name: string;
      description: string;
      price: number;
      owner: {
        id: number;
        name: string;
      };
    };
  }
  
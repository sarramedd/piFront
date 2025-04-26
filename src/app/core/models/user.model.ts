import { Feedback } from "./feedback";

export class User {
    id: number;
    cin: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    genre: string | null;  // Peut être nul
    status: string;
    dateDeNaissance: string; // Format de date ou chaîne, selon votre besoin
    role: 'ADMIN' | 'BORROWER' | 'OWNER';  // Le type de rôle correspondant à l'énumération dans Spring Boot
     // Optionnel : feedbacks de l'utilisateur
    feedbacks?: Feedback[];
  
    // Optionnel: Constructeur pour initialiser les propriétés
    constructor(
      id: number = 0,
      cin: number = 0,
      avatar?: string,
      name: string = '',
      email: string = '',
      password: string = '',
      phone: string = '',
      address: string = '',
      genre: string | null = null,
      status: string = 'Active',
      dateDeNaissance: string = '',
      role: 'ADMIN' | 'BORROWER' | 'OWNER' = 'BORROWER'  // Valeur par défaut
    ) {
      this.id = id;
      this.cin = cin;
      this.name = name;
      this.email = email;
      this.password = password;
      this.phone = phone;
      this.address = address;
      this.genre = genre;
      this.status = status;
      this.dateDeNaissance = dateDeNaissance;
      this.role = role;
    }
  }
  
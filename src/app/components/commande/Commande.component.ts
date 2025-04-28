import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Commande } from 'src/app/core/models/commande';
import { Contract } from 'src/app/core/models/contract';
import { User } from 'src/app/core/models/user.model';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CommandeService } from 'src/app/services/commande.service';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-commandes',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandesComponent implements OnInit {
  commandes: Commande[] = [];
  userId!: number;
  email:any
  user!:User;

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService,
    private contractService:ContractService,
    private authService: AuthServiceService  ,
    private router: Router
  ) { }

 // CommandesComponent.ts
 ngOnInit(): void {
  const token = this.authService.getToken();
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Payload JWT :', payload);
    this.email = payload.sub;
    this.user=payload;
  }
  
  this.commandeService.getCommandesWithItemsAndOwners(this.email).subscribe({
    next: data => {
      console.log("Commandes récupérées:", data);
      this.commandes = data;
      // Vérification si item et owner existent dans chaque commande
      this.commandes.forEach(commande => {
        if (!commande.item || !commande.item.owner.email) {
          console.warn(`Commande #${commande.id} a des données manquantes.`);
        }
      });
    },
    error: err => console.error(err)
  });
}

  
  getItemAndOwner(commande: Commande) {
    if (commande && commande.item) {
      return {
        item: commande.item,
        owner: commande.item.owner // Assurer que item et owner existent
      };
    }
    return { item: null, owner: null };
  }

  
  createNewContractFromCommande(commande: Commande) {
    // Vérifier que l'item et l'owner sont bien présents
    if (!commande || !commande.item ||  !commande.user || !commande.user.name) {
      console.error("Erreur : Informations incomplètes sur la commande ou l'item !");
      console.log(commande.item);  // Afficher les données de la commande pour déboguer
      return;
    }
  
    const item = commande.item;
    const user = commande.user;
    const itemOwnerName = item.owner ? item.owner.name : 'Propriétaire inconnu'; // Valeur par défaut si owner est manquant
  
    const contract: Contract = {
      id: 0,
      startDate: new Date(),
      endDate: new Date(), // à adapter
      terms: "Le locataire doit restituer l'objet en bon état.",
      ownerSignature: "",
      borrowerSignature: "",
      borrower: { id: user.id, name: user.name } as User,
      owner: { id: this.user.id, name: itemOwnerName } as User, // Utilisation de itemOwnerName
      details: `Nom: ${item.name}, 
                Propriétaire: ${itemOwnerName}, 
                Prix: ${item.price}€, 
                Description: ${item.description || 'Aucune description'}`, // Valeur par défaut si description est manquante
    };
  
    // ✅ Appel avec commandeId
    this.contractService.createContract(
      contract.borrower.id,
      contract.owner.id,
      commande.id, // <--- IMPORTANT
      contract
    ).subscribe({
      next: (response) => {
        console.log("Contrat créé avec succès", response);
        if (response && response.id) {
          this.router.navigate(['/contract', response.id]);
        } else {
          console.error("L'ID du contrat est manquant dans la réponse");
        }
      },
      error: (err) => {
        console.error("Erreur lors de la création du contrat", err);
      }
    });
  }
  
  
  
  
}

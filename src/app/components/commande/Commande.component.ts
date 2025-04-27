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

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService,
    private contractService:ContractService,
    private authService: AuthServiceService  ,
    private router: Router
  ) { }

 // CommandesComponent.ts
ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('userId')!;
    this.commandeService.getCommandesWithItemsAndOwners(this.userId).subscribe({
      next: data => {
        this.commandes = data;
        console.log("Commandes récupérées:", this.commandes);
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
    if (!commande || !commande.item || !commande.item.owner) {
      console.error("Erreur : Informations incomplètes sur la commande ou l'item !");
      return;
    }
  
    const item = commande.item;
  
    const contract: Contract = {
      id: 0,
      startDate: new Date(),
      endDate: new Date(), // à adapter
      terms: "Le locataire doit restituer l'objet en bon état.",
      ownerSignature: "",
      borrowerSignature: "",
      borrower: { id: commande.user.id, name: item.owner.name } as User,
      owner: { id: this.userId, name: "Moi" } as User,
      details: `Nom: ${item.name}, 
                Propriétaire: ${item.owner.name}, 
                Prix: ${item.price}€, 
                Description: ${item.description}`,
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

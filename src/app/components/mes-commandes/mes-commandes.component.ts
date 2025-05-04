import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Commande } from 'src/app/core/models/commande';
import { Contract } from 'src/app/core/models/contract';
import { User } from 'src/app/core/models/user.model';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CommandeService } from 'src/app/services/commande.service';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-mes-commandes',
  templateUrl: './mes-commandes.component.html',
  styleUrls: ['./mes-commandes.component.css']
})
export class MesCommandesComponent {
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
      if (!commande) {
        console.error("Erreur : Commande invalide !");
        return;
      }
    
      const commandeId = commande.id;
      if (!commandeId) {
        console.error("Erreur : ID de commande manquant !");
        return;
      }
    
      // 🔥 1. Récupérer l'item
      this.commandeService.getItemByCommandeId(commandeId).subscribe({
        next: (item) => {
          console.log('✅ Item récupéré:', item);
    
          // 🔥 2. Ensuite récupérer le borrower
          this.commandeService.getBorrowerByCommandeId(commandeId).subscribe({
            next: (borrower) => {
              console.log('✅ Borrower récupéré:', borrower);
    
              // ✅ Maintenant qu'on a tout, créer le contrat
              const contract: Contract = {
                id: 0,
                startDate: new Date(),
                endDate: new Date(), // à adapter si besoin
                terms: "Le locataire doit restituer l'objet en bon état.",
                ownerSignature: "",
                borrowerSignature: "",
                borrower: { id: borrower.id, name: borrower.name } as User,
                owner: { id: this.userId, name: "Moi" } as User,
                details: `Nom: ${item.name}, 
                          
                          Prix: ${item.price}€, 
                          Description: ${item.description}`,
              };
    
              console.log('📄 Contrat à créer:', contract);
    
              // 🔥 3. Appeler le service pour créer le contrat
              this.contractService.createContract(
                contract.borrower.id,
                contract.owner.id,
                commandeId,
                contract
              ).subscribe({
                next: (response) => {
                  console.log('✅ Contrat créé avec succès:', response);
                  if (response && response.id) {
                    this.router.navigate(['/contract', response.id]);
                  } else {
                    console.error("❌ L'ID du contrat est manquant dans la réponse");
                  }
                },
                error: (err) => {
                  console.error("❌ Erreur lors de la création du contrat:", err);
                }
              });
    
            },
            error: (err) => {
              console.error("❌ Erreur lors de la récupération du borrower:", err);
            }
          });
    
        },
        error: (err) => {
          console.error("❌ Erreur lors de la récupération de l'item:", err);
        }
      });
    }
    
    
    

}
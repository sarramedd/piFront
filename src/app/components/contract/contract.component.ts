import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import SignaturePad from 'signature_pad';
import { Contract } from 'src/app/core/models/contract';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements AfterViewInit {
  contract: any = {
    startDate: new Date(),
    endDate: new Date(),
    details: "Aucun détail disponible",
    terms: "Le locataire s'engage à restituer l'objet dans son état d'origine sous peine de pénalités.",
    ownerSignature: '',
    borrowerSignature: ''
  };

  contractId: number = 0; // L'ID du contrat, initialisé à 0

  @ViewChild('ownerPad', { static: false }) ownerPadElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('borrowerPad', { static: false }) borrowerPadElement!: ElementRef<HTMLCanvasElement>;

  private ownerPad!: SignaturePad;
  private borrowerPad!: SignaturePad;



  constructor(private router: Router,private contractService: ContractService,  private route: ActivatedRoute ) {}

  ngOnInit(): void {
    // Récupérez l'ID depuis les paramètres de route
    this.route.params.subscribe(params => {
      this.contractId = +params['id']; // Le '+' convertit la string en number
      console.log("ID du contrat depuis l'URL:", this.contractId);
      
      if (this.contractId) {
        this.loadContract();
      } else {
        console.error("Aucun ID de contrat trouvé dans l'URL");
      }
    });
  }
  
  loadContract() {
    this.contractService.getContractById(this.contractId).subscribe({
      next: (contractData) => {
        this.contract = contractData;
        console.log("Contrat chargé:", this.contract);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du cogntrat', err);
      }
    });
  }

  ngAfterViewInit() {
    this.ownerPad = new SignaturePad(this.ownerPadElement.nativeElement);
    this.borrowerPad = new SignaturePad(this.borrowerPadElement.nativeElement);
  }

 

  saveOwnerSignature() {
    if (!this.ownerPad.isEmpty()) {
      this.contract.ownerSignature = this.ownerPad.toDataURL();  // Conversion en base64
      alert("Signature du propriétaire enregistrée !");
    } else {
      alert("Veuillez signer avant d'enregistrer !");
    }
  }

  saveBorrowerSignature() {
    if (!this.borrowerPad.isEmpty()) {
      this.contract.borrowerSignature = this.borrowerPad.toDataURL();  // Conversion en base64
      alert("Signature du locataire enregistrée !");
    } else {
      alert("Veuillez signer avant d'enregistrer !");
    }
  }

  saveContract() {
    if (this.contract.ownerSignature && this.contract.borrowerSignature) {
      this.contractService.updateSignatures(this.contractId, this.contract).subscribe({
        next: (response) => {
          console.log('Contrat mis à jour avec succès :', response);
          alert("✅ Signatures enregistrées et contrat mis à jour !");
          // Redirection vers la page de paiement
          this.router.navigate(['/payment', this.contractId]);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du contrat', error);
          alert("❌ Une erreur est survenue.");
        }
      });
    } else {
      alert("❌ Veuillez signer le contrat avant de le valider.");
    }
  }
  
  clearOwnerSignature() {
    this.ownerPad.clear();
    this.contract.ownerSignature = '';
  }
  
  
  
  clearBorrowerSignature() {
    this.borrowerPad.clear();
    this.contract.borrowerSignature = '';
  }
  downloadContractPdf() {
    const doc = new jsPDF();
  
    // Convertir les dates en objets Date si ce n'est pas déjà le cas
    const startDate = new Date(this.contract.startDate);
    const endDate = new Date(this.contract.endDate);
  
    // Vérifier que les dates sont valides avant de les utiliser
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert('Les dates du contrat ne sont pas valides.');
      return;
    }
  
    // Ajouter les détails du contrat au PDF
    doc.text("📜 Contrat de Location", 10, 10);
    doc.text(`📅 Date de début : ${startDate.toLocaleDateString()}`, 10, 20);
    doc.text(`📅 Date de fin : ${endDate.toLocaleDateString()}`, 10, 30);
  
    // Gestion des détails du produit et des champs potentiellement "undefined"
    const productDetails = this.contract.details || "Aucun détail disponible";
    const owner = this.contract.owner || "Propriétaire inconnu";
    const price = this.contract.price ? `${this.contract.price}€` : "Prix non spécifié";
    const description = this.contract.description || "Aucune description disponible";
  
    doc.text(`📦 Détails du produit : Nom: ${productDetails}, Propriétaire: ${owner}, Prix: ${price}, Description: ${description}`, 10, 40);
  
    doc.text(`📜 Conditions Générales : ${this.contract.terms || "Aucune condition spécifiée."}`, 10, 50);
  
    // Ajouter les signatures (si disponibles)
    if (this.contract.ownerSignature) {
      doc.text("✍ Signature du Propriétaire : ", 10, 60);
      doc.addImage(this.contract.ownerSignature, 'JPEG', 10, 70, 50, 30);
    }
  
    if (this.contract.borrowerSignature) {
      doc.text("✍ Signature du Locataire : ", 10, 110);
      doc.addImage(this.contract.borrowerSignature, 'JPEG', 10, 120, 50, 30);
    }
  
    // Télécharger le PDF
    doc.save('contrat_location.pdf');
  }
  
  
}

 
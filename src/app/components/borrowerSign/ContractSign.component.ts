import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/user.model';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ContractService } from 'src/app/services/contract.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-contract-sign',
  templateUrl: './contract-sign.component.html',
  styleUrls: ['./sign.component.css'],
})
export class ContractSignComponent implements OnInit, AfterViewInit {
  contractId!: number;
  contract: any = {};
  user!: User;

  @ViewChild('borrowerPad', { static: false }) borrowerPad!: ElementRef<HTMLCanvasElement>;
  private borrowerCtx!: CanvasRenderingContext2D;
  private drawing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.user = payload;
    }

    this.contractId = +this.route.snapshot.paramMap.get('id')!;
    this.contractService.getContractById(this.contractId).subscribe({
      next: (data) => {
        this.contract = data;

        // ✅ Assurer que borrowerId et ownerId restent présents
        if (!this.contract.borrowerId) {
          this.contract.borrowerId = data.borrower?.id ?? this.user.id;
        }
        if (!this.contract.ownerId && data.owner?.id) {
          this.contract.ownerId = data.owner.id;
        }
      },
      error: (err) => console.error(err)
    });
  }

  ngAfterViewInit(): void {
    if (this.borrowerPad) {
      this.borrowerCtx = this.borrowerPad.nativeElement.getContext('2d')!;
      this.initCanvasEvents();
    }
  }

  private initCanvasEvents(): void {
    const canvas = this.borrowerPad.nativeElement;

    canvas.addEventListener('mousedown', () => this.drawing = true);
    canvas.addEventListener('mouseup', () => this.drawing = false);
    canvas.addEventListener('mouseleave', () => this.drawing = false);
    canvas.addEventListener('mousemove', (e) => {
      if (this.drawing) {
        const rect = canvas.getBoundingClientRect();
        this.borrowerCtx.lineWidth = 2;
        this.borrowerCtx.lineCap = 'round';
        this.borrowerCtx.strokeStyle = 'black';

        this.borrowerCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        this.borrowerCtx.stroke();
        this.borrowerCtx.beginPath();
        this.borrowerCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    });
  }

  clearBorrowerSignature(): void {
    const canvas = this.borrowerPad.nativeElement;
    this.borrowerCtx.clearRect(0, 0, canvas.width, canvas.height);
    this.borrowerCtx.beginPath();
    this.contract.borrowerSignature = '';
  }

  saveBorrowerSignature(): void {
    const canvas = this.borrowerPad.nativeElement;
    const signatureDataUrl = canvas.toDataURL();
    this.contract.borrowerSignature = signatureDataUrl;

    // ✅ Conserver les IDs
    if (!this.contract.borrowerId) this.contract.borrowerId = this.user.id;

    this.contractService.updateContract(this.contractId, this.contract).subscribe({
      next: () => {
        alert("✅ Signature du locataire enregistrée !");
        this.router.navigate(['/payment', this.contractId]);
      },
      error: (err) => {
        console.error(err);
        alert("❌ Erreur lors de l'enregistrement.");
      }
    });
  }

  saveContract(): void {
    if (!this.contract.borrowerId) this.contract.borrowerId = this.user.id;

    this.contractService.updateContract(this.contractId, this.contract).subscribe({
      next: () => {
        alert("✅ Contrat mis à jour avec succès !");
        this.router.navigate(['/payment', this.contractId]);
      },
      error: (err) => {
        console.error(err);
        alert("❌ Une erreur est survenue.");
      }
    });
  }

  downloadContractPdf(): void {
    const doc = new jsPDF();
    doc.text("📜 Contrat de Location", 10, 10);
    doc.text(`📅 Début : ${new Date(this.contract.startDate).toLocaleDateString()}`, 10, 20);
    doc.text(`📅 Fin : ${new Date(this.contract.endDate).toLocaleDateString()}`, 10, 30);
    doc.text(`📦 Détails : ${this.contract.details || 'Non spécifié'}`, 10, 40);
    doc.text(`💰 Prix : ${this.contract.price ?? 'Non spécifié'}`, 10, 50);
    doc.text(`📜 Conditions : ${this.contract.terms || 'Aucune'}`, 10, 60);
    if (this.contract.borrowerSignature) {
      doc.text("✍ Signature du Locataire :", 10, 70);
      doc.addImage(this.contract.borrowerSignature, 'JPEG', 10, 80, 50, 30);
    }
    doc.save("contrat.pdf");
  }

  isBorrower(): boolean {
    return this.contract.borrowerId === this.user.id;
  }
}

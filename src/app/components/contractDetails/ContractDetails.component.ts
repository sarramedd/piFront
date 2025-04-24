import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contract } from 'src/app/core/models/contract';
import { ContractService } from 'src/app/services/contract.service';
// @ts-ignore
import * as html2pdf from 'html2pdf.js';


@Component({
  selector: 'app-contract-details',
  templateUrl: './contractDetails.component.html',
  styleUrls: ['./contractDetails.component.css']
})
export class ContractDetailsComponent implements OnInit {

  contract!: Contract;

  constructor(
    private contractService: ContractService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const contractId = +this.route.snapshot.paramMap.get('id')!;
    this.contractService.getContractById(contractId).subscribe({
      next: data => this.contract = data,
      error: err => console.error(err)
    });
  }
  downloadPDF(): void {
    const element = document.getElementById('contract-pdf');
    if (element) {
      const opt = {
        margin:       0.5,
        filename:     `Contrat-${this.contract.id}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
  
      html2pdf().from(element).set(opt).save();
    }
  }
  
}

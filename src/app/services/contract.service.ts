import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contract } from '../core/models/contract';
@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private apiUrl = 'http://localhost:8088/borrowit/contracts'; 

  constructor(private http: HttpClient) {}

  getAllContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.apiUrl);
  }

  getContractById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.apiUrl}/${id}`);
  }
  createContract(borrowerId: number, ownerId: number, contract: Contract): Observable<Contract> {
    const params = new HttpParams()
      .set('borrowerId', borrowerId)
      .set('ownerId', ownerId);
  
    console.log("Données envoyées :", params.toString(), contract);

    return this.http.post<Contract>(this.apiUrl, contract, { params });
  }
  
  

  
  updateContract(id: number, contract: Contract): Observable<Contract> {
    return this.http.put<Contract>(`${this.apiUrl}/${id}`, contract);
  }
  deleteContract(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  signContract(contractId: number, ownerSignature: string, borrowerSignature: string): Observable<Contract> {
    const url = `${this.apiUrl}/${contractId}/sign`; // Assurez-vous que votre backend a cette route
    const body = { ownerSignature, borrowerSignature };
    
    return this.http.put<Contract>(url, body);
  }
  updateSignatures(contractId: number, contract: Contract): Observable<Contract> {
    return this.http.put<Contract>(`${this.apiUrl}/update-signatures/${contractId}`, contract);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../core/models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:8089/borrowit/items'; 

  constructor(private http: HttpClient) {}

  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }
}

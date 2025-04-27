import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  private url = 'http://localhost:8088/borrowit/api/items';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllitems() {
    return this.http.get(this.url + '/All', {
      headers: this.getHeaders()
    });
  }

  deleteItem(id: number) {
    return this.http.delete(this.url + '/delete/' + id, {
      headers: this.getHeaders()
    });
  }

  addItem(item: any, categoryId: number) {
    return this.http.post(this.url + '/add/' + categoryId, item, {
      headers: this.getHeaders()
    });
  }

  updateItem(id: number, item: any, categoryId: number) {
    return this.http.put(this.url + '/edit/' + id + '/' + categoryId, item, {
      headers: this.getHeaders()
    });
  }

  updateStatusItem(id: number, statusItem: string) {
    return this.http.put(this.url + '/updateStatus/' + id + '/' + statusItem, null, {
      headers: this.getHeaders()
    });
  }

  getItemById(id: number) {
    return this.http.get(this.url + '/get/' + id, {
      headers: this.getHeaders()
    });
  }
}

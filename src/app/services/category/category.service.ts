import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  private url = 'http://localhost:8088/borrowit/api/categories';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllCategories() {
    return this.http.get(this.url + '/All', {
      headers: this.getHeaders()
    });
  }

  deleteCategory(id: number) {
    return this.http.delete(this.url + '/delete/' + id, {
      headers: this.getHeaders()
    });
  }

  addCategory(category: any) {
    return this.http.post(this.url + '/add', category, {
      headers: this.getHeaders()
    });
  }

  updateCategory(id: number, category: any) {
    return this.http.put(this.url + '/edit/' + id, category, {
      headers: this.getHeaders()
    });
  }

  getCategoryById(id: number) {
    return this.http.get(this.url + '/get/' + id, {
      headers: this.getHeaders()
    });
  }
}

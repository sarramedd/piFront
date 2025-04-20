import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor( private http : HttpClient ) { }
  private url ='http://127.0.0.1:8088/api/categories' ;
    getAllCategories(){
    return this.http.get(this.url+'/All');
  }
  deleteCategory(id: number) {
    return this.http.delete(this.url + '/delete/' + id);
  }
  addCategory(category: any) {
    return this.http.post(this.url + '/add', category);
  }
  updateCategory(id: number, category: any) {
    return this.http.put(this.url + '/edit/' + id, category);
  }
  getCategoryById(id: number) {
    return this.http.get(this.url + '/get/' + id);
  }

}

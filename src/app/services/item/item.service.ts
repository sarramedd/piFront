import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor( private http : HttpClient ) { }
  private url ='http://127.0.0.1:8088/api/items' ;
    getAllitems(){
    return this.http.get(this.url+'/All');
  }
  deleteItem(id: number) {
    return this.http.delete(this.url + '/delete/' + id);
  }
  addItem(item: any, categoryId: number) {
    return this.http.post(this.url + '/add/'+categoryId, item);
  }
  updateItem(id: number, item: any, categoryId: number) {
    return this.http.put(this.url + '/edit/' + id + '/' + categoryId, item);
  }
  updateStatusItem(id: number, statusItem: string) {
    return this.http.put(this.url + '/updateStatus/' + id + '/' + statusItem, null);
  }
  getItemById(id: number) {
    return this.http.get(this.url + '/get/' + id);}
  }
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private uploadUrl = 'http://localhost:8088/cloud/upload';

  constructor(private http: HttpClient) { }

  uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('image', file, file.name);
    
    return this.http.post<any>(this.uploadUrl, formData);
  }

}

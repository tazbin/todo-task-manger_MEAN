import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly API_URL;

  constructor(
    private http: HttpClient
  ) {
    this.API_URL = 'http://localhost:3000'
   }

   get(url: string){
     return this.http.get(`${this.API_URL}/${url}`)
   }

   post(url: string, payload: object){
     return this.http.post(`${this.API_URL}/${url}`, payload)
   }

   patch(url: string, payload: object){
    return this.http.patch(`${this.API_URL}/${url}`, payload, {responseType: 'text'})
  }

   delete(url: string){
    return this.http.delete(`${this.API_URL}/${url}`)
  }
}

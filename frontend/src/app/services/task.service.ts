import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private _webRequest: WebRequestService
  ) { }

  createList(title: string){
    return this._webRequest.post('lists', {title})
  }
}

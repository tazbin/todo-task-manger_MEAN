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

  getAllTasks(){
    return this._webRequest.get('lists')
  }

  getAllItems(listId: string){
    return this._webRequest.get(`lists/${listId}/tasks`)
  }

  creatNewlist(listId: string, title: string){
    return this._webRequest.post(`lists/${listId}/tasks`, {title})
  }
  
  toggleItemComplete(listId: string, task: any){
    return this._webRequest.patch(`lists/${listId}/tasks/${task._id}`, {
      complete: !task.complete
    })
  }
}

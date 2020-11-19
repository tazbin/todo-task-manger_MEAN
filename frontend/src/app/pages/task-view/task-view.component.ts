import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

listId: string;

  lists: any;
  items: any;

  constructor(
    private _taskService: TaskService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe((params)=>{

      if(params.taskId){
        this.listId = params.taskId;
        this._taskService.getAllItems(params.taskId).subscribe((items)=>{
          this.items = items
        })
      } else{
        params.taskId = undefined
      }


    })

    this._taskService.getAllTasks().subscribe((lists)=>{
      this.lists = lists
    })
  }

  toggleComplete(item: any){
    this._taskService.toggleItemComplete(this.listId, item)
    .subscribe((res) => {
      item.complete = !item.complete
    })
  }

}

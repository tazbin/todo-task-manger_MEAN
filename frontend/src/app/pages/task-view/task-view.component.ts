import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  constructor(
    private _taskService: TaskService
  ) { }

  ngOnInit(): void {
  }

  createNewItem(){
    this._taskService.createList('open payoneer account')
    .subscribe((res: any)=>{
      console.log(res)
    })
  }

}

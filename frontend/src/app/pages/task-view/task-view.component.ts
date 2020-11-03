import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists: any;
  items: any;

  constructor(
    private _taskService: TaskService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this._route.params.subscribe((params)=>{
      // console.log(params)
      this._taskService.getAllItems(params.taskId).subscribe((items)=>{
        this.items = items
      })
    })

    this._taskService.getAllTasks().subscribe((lists)=>{
      this.lists = lists
    })


  }

}

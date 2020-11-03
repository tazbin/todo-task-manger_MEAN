import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  taskId: string;

  constructor(
    private _taskService: TaskService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe((params)=>{
      this.taskId = params.taskId
    })
  }

  createTask(title: string){
    this._taskService.creatNewlist(this.taskId, title)
    .subscribe((res: any)=>{
      // console.log(res)
      this._router.navigate([`tasks/${res._listId}`])
    })
  }

}

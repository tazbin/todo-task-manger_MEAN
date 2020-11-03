import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {

  constructor(
    private _taskService: TaskService,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  createList(title: string){
    this._taskService.createList(title)
    .subscribe((res: any)=>{
      // console.log(res)
      this._router.navigate([`tasks/${res._id}`])
    })
  }

}

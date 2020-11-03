import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewListComponent } from './pages/new-list/new-list.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';


const routes: Routes = [{
  path: '', redirectTo: 'tasks', pathMatch: 'full'
},
{
  path: 'tasks', 
  component: TaskViewComponent
},
{
  path: 'tasks/:taskId',
  component: TaskViewComponent
},
{
  path: 'new-list',
  component: NewListComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

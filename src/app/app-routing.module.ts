import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskCreateComponent } from 'src/app/pages/task-create/task-create.component';
import { TaskPreviewComponent } from 'src/app/pages/task-preview/task-preview.component';
import { TasksComponent } from 'src/app/pages/tasks/tasks.component';

const routes: Routes = [
  { path: '', component: TasksComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'tasks/preview/:documentId', component: TaskPreviewComponent },
  { path: 'tasks/create', component: TaskCreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

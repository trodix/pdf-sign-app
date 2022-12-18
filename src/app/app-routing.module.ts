import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskPreviewComponent } from 'src/app/pages/task-preview/task-preview.component';
import { TasksComponent } from 'src/app/pages/tasks/tasks.component';

const routes: Routes = [
  { path: '', component: TasksComponent },
  { path: 'preview/:documentId', component: TaskPreviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

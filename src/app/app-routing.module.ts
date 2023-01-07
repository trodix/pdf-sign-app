import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentPreviewComponent } from 'src/app/pages/document-preview/document-preview.component';
import { TaskCreateComponent } from 'src/app/pages/task-create/task-create.component';
import { TaskDocumentListComponent } from 'src/app/pages/task-document-list/task-document-list.component';
import { TasksComponent } from 'src/app/pages/tasks/tasks.component';

const routes: Routes = [
  { path: '', component: TasksComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'tasks/:taskId', component: TaskDocumentListComponent },
  { path: 'tasks/document/:documentId/preview', component: DocumentPreviewComponent },
  { path: 'tasks-create', component: TaskCreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

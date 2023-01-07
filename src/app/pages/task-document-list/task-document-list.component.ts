import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDocument, ITask, SignTaskStatus } from 'src/app/interfaces/task';
import { TasksServiceService } from 'src/app/services/tasks-service.service';

@Component({
  selector: 'app-task-document-list',
  templateUrl: './task-document-list.component.html',
  styleUrls: ['./task-document-list.component.scss']
})
export class TaskDocumentListComponent implements OnInit {

  public selectedTask: ITask | null = null;

  constructor(private route: ActivatedRoute, private tasksService: TasksServiceService, private router: Router) { }

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    if (taskId) {
      this.tasksService.getTaskById(taskId).subscribe(data => {
        this.selectedTask = data;
      });
    }
  }

  canPreview(doc: IDocument): boolean {
    return true;
  }

  previewDocument(doc: IDocument) {
    this.router.navigate([`/tasks/document/${doc.documentId}/preview`]);
  }

  canDownload(task: ITask) {
    return task.signTaskStatus == SignTaskStatus.SIGNED.toString();
  }

  download(doc: IDocument) {
    this.tasksService.downloadDocument(doc);
  }

}

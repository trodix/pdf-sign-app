import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { SignTaskStatus, Task, TasksServiceService } from 'src/app/services/tasks-service.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  public userTasks$: Observable<Task[]> = new Observable();

  public selectedTask: Task | null = null;

  constructor(private readonly oauthService: OAuthService, private tasksService: TasksServiceService, private router: Router) { }

  ngOnInit(): void {
    this.userTasks$ = this.tasksService.loadTasksForCurrentUser();
  }

  public get email() {
    let claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return claims['email'];
  }

  openTask(task: Task): void {
    this.router.navigate([`/tasks/preview/${task.documentId}`]);
  }

  canPreview(task: Task): boolean {
    return true;
  }

  canCancel(task: Task): boolean {
    return this.email == task.senderEmail;
  }

  canDownload(task: Task) {
    return task.signTaskStatus == SignTaskStatus.SIGNED.toString();
  }

  download(task: Task) {
    this.tasksService.downloadDocument(task);
  }

}

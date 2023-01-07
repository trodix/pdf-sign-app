import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { ITask, SignTaskStatus } from 'src/app/interfaces/task';
import { TasksServiceService } from 'src/app/services/tasks-service.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  public userTasks$: Observable<ITask[]> = new Observable();

  constructor(private readonly oauthService: OAuthService, private tasksService: TasksServiceService, private router: Router) { }

  ngOnInit(): void {
    this.userTasks$ = this.tasksService.loadTasksForCurrentUser();
  }

  public get email() {
    let claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return claims['email'];
  }

  openTask(task: ITask): void {
    console.log(task)
    this.router.navigate(['tasks', task.taskId]);
  }

  canCancel(task: ITask): boolean {
    return this.email == task.initiator;
  }



}

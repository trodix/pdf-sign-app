import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Task, TasksServiceService } from 'src/app/services/tasks-service.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  public userTasks$: Observable<Task[]> = new Observable();

  public selectedTask: Task | null = null;

  constructor(private tasksService: TasksServiceService, private router: Router) { }

  ngOnInit(): void {
    this.userTasks$ = this.tasksService.loadTasksForCurrentUser();
  }

  openTask(task: Task): void {
    this.router.navigate([`/preview/${task.documentId}`]);
  }

}

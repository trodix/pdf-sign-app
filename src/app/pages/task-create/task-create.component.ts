import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CreateTaskRequest, TasksServiceService } from 'src/app/services/tasks-service.service';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})
export class TaskCreateComponent implements OnInit {

  createTaskForm: FormGroup;

  minDateValue: Date = new Date();

  constructor(private messageService: MessageService, private router: Router, private tasksService: TasksServiceService) { }

  ngOnInit(): void {
    this.createTaskForm = new FormGroup({
      dueDate: new FormControl(new Date(), Validators.required),
      recipientEmail: new FormControl("", [Validators.required, Validators.email]),
      document: new FormControl(null, [Validators.required])
    });
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    if (files.length > 0) {
      const file = files[0];
      this.createTaskForm.patchValue({
        document: file
      });
    }
  }

  createTask() {
    const createTaskRequest: CreateTaskRequest = {
      document: this.createTaskForm.get('document')?.value,
      dueDate: this.createTaskForm.get('dueDate')?.value,
      recipientEmail: this.createTaskForm.get('recipientEmail')?.value
    }
    this.tasksService.createTask(createTaskRequest).subscribe({ 
      complete: () => {
        this.messageService.add({ severity: 'success', summary: 'Task created with success', detail: '' });
        this.router.navigate([`/tasks`]);
      }, 
      error: (error: Error) => {
        this.messageService.add({ severity: 'error', summary: 'Error while creating the task. Please try again later.', detail: error.message });
      }
    });
  }

}

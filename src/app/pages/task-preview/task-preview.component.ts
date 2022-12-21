import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { MessageService } from 'primeng/api';
import { SignTaskRequest, TasksServiceService } from 'src/app/services/tasks-service.service';

@Component({
  selector: 'app-task-preview',
  templateUrl: './task-preview.component.html',
  styleUrls: ['./task-preview.component.scss']
})
export class TaskPreviewComponent implements OnInit {

  @ViewChild('pdfViewer')
  public pdfViewer: PdfJsViewerComponent;

  public documentId: string | null = null

  public displayModal = false

  public signTaskForm: FormGroup;

  constructor(private tasksService: TasksServiceService, private route: ActivatedRoute, private messageService: MessageService) { }

  ngOnInit(): void {
    this.documentId = this.route.snapshot.paramMap.get('documentId');

    if (this.documentId) {
      this.tasksService.getDocumentPreview(this.documentId).subscribe(data => {
        this.pdfViewer.pdfSrc = data;
        // TODO get the task and set the value of downloadFileName with originalFilename
        this.pdfViewer.downloadFileName = "documentId"
        this.pdfViewer.refresh();
      });
    }

    this.signTaskForm = new FormGroup({
      reason: new FormControl(null, Validators.required),
      location: new FormControl(null, Validators.required),
      certificate: new FormControl(null, Validators.required),
      p12Password: new FormControl(null, Validators.required)
    });
  }

  showModal() {
    this.displayModal = true;
  }

  closeModal() {
    this.displayModal = false;
  }

  onSelectedCertificate(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    if (files.length > 0) {
      const certificate = files[0];
      this.signTaskForm.patchValue({
        certificate: certificate
      });
    }
  }

  signDocument() {
    if (this.documentId) {
      console.log(`${this.documentId}`);
      const signTaskRequest: SignTaskRequest = {
        reason: this.signTaskForm.get("reason")?.value,
        location: this.signTaskForm.get("location")?.value,
        cert: this.signTaskForm.get("certificate")?.value,
        p12Password: this.signTaskForm.get("p12Password")?.value
      }
      this.tasksService.signDocument(this.documentId, signTaskRequest).subscribe({
        complete: () => {
          this.closeModal();
          this.signTaskForm.reset();
          this.messageService.add({ severity: 'success', summary: `Document signed with success`, detail: '' });
        }, 
        error: (error: Error) => {
          this.messageService.add({ severity: 'error', summary: `Error while signing the document. Try again later.`, detail: error.message });
        }
      })
    }
  }

}

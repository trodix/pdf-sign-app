import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { TasksServiceService } from 'src/app/services/tasks-service.service';

@Component({
  selector: 'app-task-preview',
  templateUrl: './task-preview.component.html',
  styleUrls: ['./task-preview.component.scss']
})
export class TaskPreviewComponent implements OnInit {

  @ViewChild('pdfViewer')
  public pdfViewer: PdfJsViewerComponent;

  constructor(private tasksService: TasksServiceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const documentId = this.route.snapshot.paramMap.get('documentId');
    if (documentId) {
      this.tasksService.getDocumentPreview(documentId).subscribe(data => {
        this.pdfViewer.pdfSrc = data;
        // TODO get the task and set the value of downloadFileName with originalFilename
        this.pdfViewer.downloadFileName = "documentId"
        this.pdfViewer.refresh();
      });
    }
  }

}

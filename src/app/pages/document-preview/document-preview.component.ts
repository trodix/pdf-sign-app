import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { MessageService } from 'primeng/api';
import { IDocument, ITask, SignTaskRequest, SignTaskStatus } from 'src/app/interfaces/task';
import { TasksServiceService } from 'src/app/services/tasks-service.service';

export interface Rectangle {
  page: number, x: number, y: number, w: number, h: number
}

@Component({
  selector: 'app-document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.scss']
})
export class DocumentPreviewComponent implements OnInit {

  @ViewChild('pdfViewer')
  public pdfViewer: PdfJsViewerComponent;

  public selectedDocument: IDocument | null;

  public selectedTask: ITask | null = null;

  public displayModal = false

  public signTaskForm: FormGroup;

  public rectElement: Rectangle[] = [];

  constructor(
    private readonly oauthService: OAuthService,
    private tasksService: TasksServiceService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const documentId = this.route.snapshot.paramMap.get('documentId');

    if (documentId) {

      this.tasksService.getTaskByDocumentId(documentId).subscribe(data => {
        this.selectedTask = data;
        console.log(this.selectedTask);

        this.selectedDocument = this.selectedTask.documentList.find(d => d.documentId == documentId) || null;
        this.initDocument();
      });

    }

    this.signTaskForm = new FormGroup({
      reason: new FormControl(null, Validators.required),
      location: new FormControl(null, Validators.required),
      certificate: new FormControl(null, Validators.required),
      p12Password: new FormControl(null, Validators.required)
    });
  }

  initDocument() {
    
    if (this.selectedTask) {
      if (this.selectedTask.signTaskStatus == SignTaskStatus.SIGNED) {
        this.fetchSignedDocumentForPreview();
      } else {
        this.fetchDocumentForPreview();
      }
    }

  }

  fetchSignedDocumentForPreview() {
    if (!this.selectedDocument) {
      return;
    }
    this.tasksService.getSignedDocumentPreview(this.selectedDocument.documentId).subscribe(data => {
      if (!this.selectedDocument) {
        return;
      }
      this.pdfViewer.pdfSrc = data;
      this.pdfViewer.downloadFileName = this.selectedDocument.originalFileName;
      this.pdfViewer.refresh();
    })
  }

  fetchDocumentForPreview() {
    if (!this.selectedDocument) {
      return;
    }

    this.tasksService.getDocumentPreview(this.selectedDocument.documentId).subscribe(data => {
      if (!this.selectedDocument) {
        return;
      }
      this.pdfViewer.pdfSrc = data;
      this.pdfViewer.downloadFileName = this.selectedDocument.originalFileName;
      this.pdfViewer.refresh();

      if (!this.canSign()) {
        return;
      }

      setTimeout(() => {

        const observer = new MutationObserver((mutations_list) => {
          mutations_list.forEach((mutation) => {
            mutation.addedNodes.forEach((added_node) => {
              if ((added_node as Element).className.includes('canvasWrapper')) {
                this.registerSignatureCanvasLayers();
                observer.disconnect();
              }
            });
          });
        });

        const viewer = document.querySelector("iframe")?.contentWindow?.document.querySelector("#viewer");
        if (viewer) {
          observer.observe(viewer, { subtree: true, childList: true });
        }

        this.registerSignatureCanvasLayers();
      }, 1000);

    });
  }

  registerSignatureCanvasLayers() {

    if (!this.canSign()) {
      return;
    }
    
    const pageList = document.querySelector("iframe")?.contentWindow?.document.querySelectorAll(".page");
    const elementPageList: Element[] = [];

    pageList?.forEach(item => {
      elementPageList.push(item);
    });

    elementPageList?.forEach(page => {
      const pageNumber = elementPageList.indexOf(page) + 1;
      const origCanvas: HTMLDivElement = page.querySelector(".canvasWrapper") as HTMLDivElement;
      const layer = document.createElement("canvas");

      if (origCanvas && page) {

        layer.id = 'layer-' + pageNumber;
        layer.width = page.clientWidth;
        layer.height = page.clientHeight;
        layer.style.position = "absolute";
        layer.style.zIndex = "999999";
        //layer.style.border = "2px solid red"

        const contextLayer = layer.getContext('2d');

        origCanvas.style.display = "flex";
        origCanvas.appendChild(layer)

        if (page.classList.contains("layer-click-event")) {
          return;
        }

        page.classList.add("layer-click-event");
        console.log("Registered click event");

        contextLayer?.translate(0, layer.height)

        page.addEventListener('click', (e) => {

          const mouseX = (e as MouseEvent).offsetX;
          const mouseY = (e as MouseEvent).offsetY;

          this.clearCanvas(elementPageList, this.rectElement);

          if (contextLayer) {
            this.rectElement = [];

            const rectWidth = 200;
            const rectHeight = 100;
            const rectX = (mouseX - rectWidth / 2);
            const rectY = (mouseY - rectHeight / 2) - layer.height;

            contextLayer.rect(rectX, rectY, rectWidth, rectHeight);
            contextLayer.fillStyle = "rgba(150, 200, 240, 0.3)";
            contextLayer.fillRect(rectX, rectY, rectWidth, rectHeight);

            const rect: Rectangle = { page: pageNumber, x: rectX, y: rectY, w: rectWidth, h: rectHeight };

            this.rectElement.push(rect);

            console.log(`added rect on page ${rect.page} at (x=${rect.x}, y=${rect.y})`);
            this.tasksService.convertCoordonates(rect);
          }

        });

      }

    });

  }

  clearCanvas(pageList: Element[], rectangleList: Rectangle[]) {

    pageList.forEach(page => {
      rectangleList.forEach(rectangle => {
        const currentCanvasIteration = page.querySelector('#layer-' + rectangle.page) as HTMLCanvasElement;
        if (currentCanvasIteration) {
          const currentCtx = currentCanvasIteration.getContext('2d');
          if (currentCtx) {
            currentCtx.clearRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
          }
        }
      });
    });

  }

  showModal() {
    this.displayModal = true;
  }

  closeModal() {
    this.displayModal = false;
  }

  public get email() {
    let claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return claims['email'];
  }

  canSign(): boolean {
    if (this.selectedTask) {
      return this.selectedTask.taskRecipientList.map(u => u.email).includes(this.email) && this.selectedTask.signTaskStatus != SignTaskStatus.SIGNED.toString();
    }
    return false;
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
    if (this.selectedDocument) {
      const signTaskRequest: SignTaskRequest = {
        reason: this.signTaskForm.get("reason")?.value,
        location: this.signTaskForm.get("location")?.value,
        cert: this.signTaskForm.get("certificate")?.value,
        p12Password: this.signTaskForm.get("p12Password")?.value
      }
      const signZoneOnCanvas = this.rectElement[0];
      let signZone: Rectangle | undefined = undefined;
      if (signZoneOnCanvas) {
        signZone = this.tasksService.convertCoordonates(signZoneOnCanvas);
      }

      this.tasksService.signDocument(this.selectedDocument.documentId, signTaskRequest, signZone).subscribe({
        complete: () => {
          this.closeModal();
          this.signTaskForm.reset();
          this.router.navigate([`/tasks`]);
          this.messageService.add({ severity: 'success', summary: `Document signed with success`, detail: '' });
        },
        error: (error: Error) => {
          this.messageService.add({ severity: 'error', summary: `Error while signing the document. Try again later.`, detail: error.message });
        }
      });
    }
  }

  canDownload() {
    if (!this.selectedTask) {
      return false;
    }
    return this.selectedTask.initiator.email == this.email && this.selectedTask.signTaskStatus == SignTaskStatus.SIGNED.toString();
  }

  download() {
    if (this.selectedDocument) {
      this.tasksService.downloadDocument(this.selectedDocument);
    }
  }

}

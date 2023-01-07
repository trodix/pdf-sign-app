import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTaskRequest, IDocument, ITask, SignTaskRequest, SignTaskResponse } from 'src/app/interfaces/task';
import { Rectangle } from 'src/app/pages/document-preview/document-preview.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksServiceService {

  constructor(private http: HttpClient) { }

  public loadTasksForCurrentUser(): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${environment.backend.BACKEND_API_BASE_URL}/sign/task/list`);
  }

  public getDocumentPreview(documentId: string): Observable<Blob> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.http.get(`${environment.backend.BACKEND_API_BASE_URL}/sign/document/${documentId}/preview`, { headers: headers, responseType: 'blob' });
  }

  public getSignedDocumentPreview(documentId: string): Observable<Blob> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.http.get(`${environment.backend.BACKEND_API_BASE_URL}/sign/signed-document/${documentId}/preview`, { headers: headers, responseType: 'blob' });
  }

  public createTask(createTaskRequest: CreateTaskRequest): Observable<ITask> {
    const formData = new FormData();
    
    createTaskRequest.documentList.forEach(d => {
      formData.append("documentList", d);
    });

    createTaskRequest.recipientList.forEach(r => {
      formData.append("recipientList", r);
    });
    
    formData.append("dueDate", createTaskRequest.dueDate.toISOString());

    return this.http.post<ITask>(`${environment.backend.BACKEND_API_BASE_URL}/sign/task`, formData);
  }

  /**
   * Convert rect coordonated from px to pt
   * 
   * https://kb.itextpdf.com/home/it7kb/faq/how-to-get-the-userunit-from-a-pdf-file
   * 
   * https://stackoverflow.com/a/10855277/10315605
   * 
   * @param rect The coordonates from the sign zone selection
   * 
   * @returns Converted coordonates for backend usage in iTextPDF (distances in pt)
   */
  public convertCoordonates(rect: Rectangle): Rectangle {
    // Converting location from px to pt as the distence unit of PDF files is pt and not px
    const pxToPtRatio = 3 / 4;
    const convertedCoordonates: Rectangle = {
      page: rect.page,
      x: pxToPtRatio * rect.x,
      y: pxToPtRatio * -(rect.y + rect.h),
      w: rect.w,
      h: rect.h
    }

    console.log(`Converted rect coordonates from`);
    console.log(rect);
    console.log(`to`);
    console.log(convertedCoordonates);

    return convertedCoordonates;
  }

  public signDocument(documentId: string, signTaskRequest: SignTaskRequest, signZone?: Rectangle) {
    const formData = new FormData();
    formData.append("reason", signTaskRequest.reason);
    formData.append("location", signTaskRequest.location);
    formData.append("p12Password", signTaskRequest.p12Password);
    formData.append("cert", signTaskRequest.cert);
    if (signZone) {
      formData.append("signPageNumber", signZone.page.toString());
      formData.append("signXPos", signZone.x.toString());
      formData.append("signYPos", signZone.y.toString());
    }

    return this.http.post<SignTaskResponse>(`${environment.backend.BACKEND_API_BASE_URL}/sign/${documentId}`, formData);
  }

  public getTaskById(taskId: string): Observable<ITask> {
    return this.http.get<ITask>(`${environment.backend.BACKEND_API_BASE_URL}/sign/task/${taskId}`);
  }

  public getTaskByDocumentId(documentId: string): Observable<ITask> {
    return this.http.get<ITask>(`${environment.backend.BACKEND_API_BASE_URL}/sign/task/document/${documentId}`);
  }

  public downloadDocument(doc: IDocument): void {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/octet-stream');

    this.http.get(`${environment.backend.BACKEND_API_BASE_URL}/sign/${doc.documentId}`, { headers: headers, responseType: 'blob' }).subscribe(file => {
      const blob = new Blob([file], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.originalFileName;
      a.click();
    });
  }

}

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Task {
  originalFileName: string;
  documentId: string;
  senderEmail: string;
  recipientEmail: string;
  dueDate: Date;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TasksServiceService {

  constructor(private http: HttpClient) { }

  public loadTasksForCurrentUser(): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.backend.BACKEND_API_BASE_URL}/sign/task/list`);
  }

  public getDocumentPreview(documentId: string): Observable<Blob> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.http.get(`${environment.backend.BACKEND_API_BASE_URL}/sign/task/preview/${documentId}`, { headers: headers, responseType: 'blob' });
  }

}

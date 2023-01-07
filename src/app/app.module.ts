import { NgModule } from '@angular/core';Document
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { AuthConfigModule } from '../config/auth.config.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DocumentPreviewComponent } from './pages/document-preview/document-preview.component';
import { TaskCreateComponent } from './pages/task-create/task-create.component';
import { TaskDocumentListComponent } from './pages/task-document-list/task-document-list.component';
import { TasksComponent } from './pages/tasks/tasks.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TasksComponent,
    DocumentPreviewComponent,
    TaskCreateComponent,
    TaskDocumentListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    PdfJsViewerModule,
    AuthConfigModule,
    TableModule,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    FileUploadModule,
    ToastModule,
    DialogModule,
    InputTextareaModule
  ],
  providers: [
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

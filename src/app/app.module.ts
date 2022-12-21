import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from '@angular/forms';

import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

import { TableModule} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { AuthConfigModule } from '../config/auth.config.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { TaskPreviewComponent } from './pages/task-preview/task-preview.component';
import { TaskCreateComponent } from './pages/task-create/task-create.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TasksComponent,
    TaskPreviewComponent,
    TaskCreateComponent
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

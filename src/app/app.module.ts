import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

import { AuthConfigModule } from '../config/auth.config.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TasksComponent } from './pages/tasks/tasks.component';

import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import { TaskPreviewComponent } from './pages/task-preview/task-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TasksComponent,
    TaskPreviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PdfJsViewerModule,
    AuthConfigModule,
    TableModule,
    ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

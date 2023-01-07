import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDocumentListComponent } from './task-document-list.component';

describe('TaskDocumentListComponent', () => {
  let component: TaskDocumentListComponent;
  let fixture: ComponentFixture<TaskDocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskDocumentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataIngestionComponent } from './data-ingestion.component';

describe('DataIngestionComponent', () => {
  let component: DataIngestionComponent;
  let fixture: ComponentFixture<DataIngestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataIngestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataIngestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

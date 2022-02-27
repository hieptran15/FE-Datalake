import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorIngestionComponent } from './monitor-ingestion.component';

describe('MonitorIngestionComponent', () => {
  let component: MonitorIngestionComponent;
  let fixture: ComponentFixture<MonitorIngestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorIngestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorIngestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

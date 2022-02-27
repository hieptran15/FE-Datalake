import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatalakeDashboardComponent } from './datalake-dashboard.component';

describe('DatalakeDashboardComponent', () => {
  let component: DatalakeDashboardComponent;
  let fixture: ComponentFixture<DatalakeDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatalakeDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatalakeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatalakeDashboardAdminComponent } from './datalake-dashboard-admin.component';

describe('DatalakeDashboardAdminComponent', () => {
  let component: DatalakeDashboardAdminComponent;
  let fixture: ComponentFixture<DatalakeDashboardAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatalakeDashboardAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatalakeDashboardAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

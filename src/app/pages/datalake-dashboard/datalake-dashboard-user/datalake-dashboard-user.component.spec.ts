import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatalakeDashboardUserComponent } from './datalake-dashboard-user.component';

describe('DatalakeDashboardUserComponent', () => {
  let component: DatalakeDashboardUserComponent;
  let fixture: ComponentFixture<DatalakeDashboardUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatalakeDashboardUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatalakeDashboardUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

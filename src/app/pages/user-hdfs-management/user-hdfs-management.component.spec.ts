import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHdfsManagementComponent } from './user-hdfs-management.component';

describe('UserHdfsManagementComponent', () => {
  let component: UserHdfsManagementComponent;
  let fixture: ComponentFixture<UserHdfsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserHdfsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHdfsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

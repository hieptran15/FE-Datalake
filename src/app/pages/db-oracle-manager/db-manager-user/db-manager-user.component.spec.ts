import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbManagerUserComponent } from './db-manager-user.component';

describe('DbManagerUserComponent', () => {
  let component: DbManagerUserComponent;
  let fixture: ComponentFixture<DbManagerUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbManagerUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbManagerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

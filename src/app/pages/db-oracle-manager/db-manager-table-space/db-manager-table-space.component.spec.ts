import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbManagerTableSpaceComponent } from './db-manager-table-space.component';

describe('DbManagerTableSpaceComponent', () => {
  let component: DbManagerTableSpaceComponent;
  let fixture: ComponentFixture<DbManagerTableSpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbManagerTableSpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbManagerTableSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

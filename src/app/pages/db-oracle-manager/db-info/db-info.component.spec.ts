import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbInfoComponent } from './db-info.component';

describe('DbInfoComponent', () => {
  let component: DbInfoComponent;
  let fixture: ComponentFixture<DbInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

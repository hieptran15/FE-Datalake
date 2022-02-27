import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbOracleManagerComponent } from './db-oracle-manager.component';

describe('DbOracleManagerComponent', () => {
  let component: DbOracleManagerComponent;
  let fixture: ComponentFixture<DbOracleManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbOracleManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbOracleManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserThriftComponent } from './user-thrift.component';

describe('UserThriftComponent', () => {
  let component: UserThriftComponent;
  let fixture: ComponentFixture<UserThriftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserThriftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserThriftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

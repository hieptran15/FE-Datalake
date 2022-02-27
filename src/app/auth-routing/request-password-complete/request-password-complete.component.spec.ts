import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPasswordCompleteComponent } from './request-password-complete.component';

describe('RequestPasswordCompleteComponent', () => {
  let component: RequestPasswordCompleteComponent;
  let fixture: ComponentFixture<RequestPasswordCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPasswordCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPasswordCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertIsdnComponent } from './alert-isdn.component';

describe('AlertIsdnComponent', () => {
  let component: AlertIsdnComponent;
  let fixture: ComponentFixture<AlertIsdnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertIsdnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertIsdnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsAlertConfigComponent } from './sms-alert-config.component';

describe('SmsAlertConfigComponent', () => {
  let component: SmsAlertConfigComponent;
  let fixture: ComponentFixture<SmsAlertConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsAlertConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsAlertConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

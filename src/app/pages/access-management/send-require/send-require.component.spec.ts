import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendRequireComponent } from './send-require.component';

describe('SendRequireComponent', () => {
  let component: SendRequireComponent;
  let fixture: ComponentFixture<SendRequireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendRequireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendRequireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

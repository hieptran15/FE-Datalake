import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformLogComponent } from './perform-log.component';

describe('PerformLogComponent', () => {
  let component: PerformLogComponent;
  let fixture: ComponentFixture<PerformLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

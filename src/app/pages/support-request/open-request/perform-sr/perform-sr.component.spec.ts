import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformSRComponent } from './perform-sr.component';

describe('PerformSRComponent', () => {
  let component: PerformSRComponent;
  let fixture: ComponentFixture<PerformSRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformSRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformSRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

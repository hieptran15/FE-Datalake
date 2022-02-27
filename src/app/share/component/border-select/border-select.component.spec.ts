import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorderSelectComponent } from './border-select.component';

describe('BorderSelectComponent', () => {
  let component: BorderSelectComponent;
  let fixture: ComponentFixture<BorderSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorderSelectComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorderSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

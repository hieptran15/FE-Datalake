import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpAppComponent } from './rp-app.component';

describe('RpAppComponent', () => {
  let component: RpAppComponent;
  let fixture: ComponentFixture<RpAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

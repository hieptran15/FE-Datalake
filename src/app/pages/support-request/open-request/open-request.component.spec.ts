import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRequestComponent } from './open-request.component';

describe('OpenRequestComponent', () => {
  let component: OpenRequestComponent;
  let fixture: ComponentFixture<OpenRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

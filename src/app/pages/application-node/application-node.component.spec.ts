import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationConfigComponent } from './application-node.component';

describe('ApplicationConfigComponent', () => {
  let component: ApplicationConfigComponent;
  let fixture: ComponentFixture<ApplicationConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationConfigComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

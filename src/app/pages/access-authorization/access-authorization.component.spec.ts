import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessAuthorizationComponent } from './access-authorization.component';

describe('AccessAuthorizationComponent', () => {
  let component: AccessAuthorizationComponent;
  let fixture: ComponentFixture<AccessAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

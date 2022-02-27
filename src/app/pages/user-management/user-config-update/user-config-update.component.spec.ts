import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConfigUpdateComponent } from './user-config-update.component';

describe('UserConfigUpdateComponent', () => {
  let component: UserConfigUpdateComponent;
  let fixture: ComponentFixture<UserConfigUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserConfigUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConfigUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

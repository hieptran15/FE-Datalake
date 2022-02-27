import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditAppComponent } from './add-or-edit-app.component';

describe('AddOrEditAppComponent', () => {
  let component: AddOrEditAppComponent;
  let fixture: ComponentFixture<AddOrEditAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrEditAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrEditAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

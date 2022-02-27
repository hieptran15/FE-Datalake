import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigMakeFileDbComponent } from './config-make-file-db.component';

describe('ConfigMakeFileDbComponent', () => {
  let component: ConfigMakeFileDbComponent;
  let fixture: ComponentFixture<ConfigMakeFileDbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigMakeFileDbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigMakeFileDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

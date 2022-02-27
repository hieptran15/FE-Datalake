import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAtlasComponent } from './update-atlas.component';

describe('UpdateAtlasComponent', () => {
  let component: UpdateAtlasComponent;
  let fixture: ComponentFixture<UpdateAtlasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateAtlasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAtlasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

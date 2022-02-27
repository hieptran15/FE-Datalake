import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncodeToolComponent } from './encode-tool.component';

describe('EncodeToolComponent', () => {
  let component: EncodeToolComponent;
  let fixture: ComponentFixture<EncodeToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncodeToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncodeToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

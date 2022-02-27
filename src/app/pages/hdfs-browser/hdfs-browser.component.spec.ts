import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HdfsBrowserComponent } from './hdfs-browser.component';

describe('HdfsBrowserComponent', () => {
  let component: HdfsBrowserComponent;
  let fixture: ComponentFixture<HdfsBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HdfsBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HdfsBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

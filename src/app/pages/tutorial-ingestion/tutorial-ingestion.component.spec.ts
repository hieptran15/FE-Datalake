import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialIngestionComponent } from './tutorial-ingestion.component';

describe('TutorialIngestionComponent', () => {
  let component: TutorialIngestionComponent;
  let fixture: ComponentFixture<TutorialIngestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialIngestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialIngestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationClustersNewComponent } from './application-clusters-new.component';

describe('ApplicationClustersNewComponent', () => {
  let component: ApplicationClustersNewComponent;
  let fixture: ComponentFixture<ApplicationClustersNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationClustersNewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationClustersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

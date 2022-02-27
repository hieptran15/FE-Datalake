import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationClusterComponent } from './application-cluster.component';

describe('ApplicationClusterComponent', () => {
  let component: ApplicationClusterComponent;
  let fixture: ComponentFixture<ApplicationClusterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationClusterComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

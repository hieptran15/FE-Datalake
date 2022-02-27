import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChartDetailComponent } from './group-chart-detail.component';

describe('GroupChartDetailComponent', () => {
  let component: GroupChartDetailComponent;
  let fixture: ComponentFixture<GroupChartDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupChartDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChartDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

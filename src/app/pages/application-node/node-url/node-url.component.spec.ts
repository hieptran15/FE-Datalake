import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeUrlComponent } from './node-url.component';

describe('NodeUrlComponent', () => {
  let component: NodeUrlComponent;
  let fixture: ComponentFixture<NodeUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

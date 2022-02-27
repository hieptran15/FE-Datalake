import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThriftManagerComponent } from './thrift-manager.component';

describe('ThriftManagerComponent', () => {
  let component: ThriftManagerComponent;
  let fixture: ComponentFixture<ThriftManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThriftManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThriftManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIptableComponent } from './edit-iptable.component';

describe('EditIptableComponent', () => {
  let component: EditIptableComponent;
  let fixture: ComponentFixture<EditIptableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIptableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIptableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IptableRuleComponent } from './iptable-rule.component';

describe('IptableRuleComponent', () => {
  let component: IptableRuleComponent;
  let fixture: ComponentFixture<IptableRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IptableRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IptableRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

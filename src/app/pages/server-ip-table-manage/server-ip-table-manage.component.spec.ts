import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerIpTableManageComponent } from './server-ip-table-manage.component';

describe('ServerIpTableManageComponent', () => {
  let component: ServerIpTableManageComponent;
  let fixture: ComponentFixture<ServerIpTableManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerIpTableManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerIpTableManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

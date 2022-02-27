import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkNewComponent } from './link-new.component';

describe('LinkNewComponent', () => {
  let component: LinkNewComponent;
  let fixture: ComponentFixture<LinkNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkNewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

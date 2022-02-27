import {AfterContentChecked, ChangeDetectorRef, Component} from '@angular/core';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout>
      <nb-layout-header #header [ngClass]="test(sidebar, header)" subheader>
        <ngx-header (emitSelectWidth)="selectWidth($event)"></ngx-header>
      </nb-layout-header>
      <nb-sidebar [state]="'expanded'" #sidebar responsive>
        <ngx-slidebar></ngx-slidebar>
      </nb-sidebar>
      <nb-layout-column style="margin-top: 40px;">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
<!--      <nb-layout-footer>-->
<!--        <ngx-footer class="edit-footer"></ngx-footer>-->
<!--      </nb-layout-footer>-->
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent implements AfterContentChecked {
  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }
  check: boolean

  selectWidth(event: boolean) {
    this.check = event
  }

  ngAfterContentChecked(): void {
    this.changeDetectorRef.detectChanges();

  }

  test(sidebar, header) {
    return sidebar?.element.nativeElement.classList?.contains('expanded') ? 'headerCheck' : 'headerChecked';
  }
}

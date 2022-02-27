import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {Page} from '../../../@core/model/page.model';

@Component({
  selector: 'ngx-link-table',
  templateUrl: './link-table.component.html',
  styleUrls: ['./link-table.component.scss'],
})
export class LinkTableComponent implements OnInit {


  columns = [
    {name: 'Từ cụm', prop: 'fromCluster', flexGrow: 1},
    {name: 'Từ ứng dụng', prop: 'fromApplication', flexGrow: 2},
    {name: 'Đến cụm', prop: 'toCluster', flexGrow: 2},
    {name: 'Đến ứng dụng', prop: 'toApplication', flexGrow: 2},
    {name: 'Tên liên kết', prop: 'linkName', flexGrow: 2},
    {name: 'Hành động', prop: 'action_btn', flexGrow: 2},
  ];
  @Input() page = new Page();
  @Input() title: string;
  links: any[] = new Array<any>();
  constructor(private dialogService: NbDialogService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }
  addLink() {
    const ref = this.dialogService.open(LinkTableComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
      },
    });
    ref.onClose.subscribe(res => {
    });
  }

  ngOnInit(): void {
  }
}

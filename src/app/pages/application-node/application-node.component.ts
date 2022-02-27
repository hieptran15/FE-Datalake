import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ApplicationNewComponent} from './application-new/application-new.component';
import {Page} from '../../@core/model/page.model';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {ApplicationNodeService} from '../../services/application-node.service';
import {ConfirmDialogComponent} from '../../share/component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'ngx-application-node',
  templateUrl: './application-node.component.html',
  styleUrls: ['./application-node.component.scss'],
})
export class ApplicationNodeComponent implements OnInit, OnChanges {
  columns = [
    {name: 'STT', prop: 'id', flexGrow: 1},
    {name: 'Cụm', prop: 'treeName', flexGrow: 3},
    {name: 'Loại ứng dụng', prop: 'nodeType', flexGrow: 2},
    {name: 'Tên ứng dụng', prop: 'nodeName', flexGrow: 3},
    {name: 'Hành động', prop: 'action_btn', flexGrow: 2},
  ];
  @Input() page = new Page();
  @Input() title: string;
  @Input() keyword: string;
  @Input()  cluster: any;
  applicationNodes: any[] = new Array<any>();
  saveKeyword: string = '';

  constructor(
    private applicationNodeService: ApplicationNodeService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    this.setPage(this.page)
  }
  search(cluster: any): void {
    this.cluster = cluster
    this.saveKeyword = '' + (this.keyword ? this.keyword.trim() : '');
    this.setPage({offset: 0});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cluster) {
      if (changes.cluster.currentValue) {
        this.setPage({offset: 0});
      } else {
        this.page.totalElements = 0;
        this.page.pageNumber = 0;
        this.applicationNodes = [];
      }
    }
  }

  setPage(pageInfo?) {
    const pageToLoad: number = pageInfo.offset || pageInfo.pageNumber;
    this.applicationNodeService.query({
      clusterIds: [this.cluster ? this.cluster!.id : null],
      page: pageToLoad,
      size: 10,
      keyword: (this.saveKeyword || '').replace(/\+/gi, '%2B')
    }).subscribe(res => {
      this.page.totalElements = Number(res.headers.get('X-Total-Count'));
      this.page.pageNumber = pageToLoad || 0;
      this.applicationNodes = res.body || [];
    });
  }


  addApplication() {
    const ref = this.dialogService.open(ApplicationNewComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      autoFocus: true,
      context: {
        title: `Thêm ứng dụng'`,
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.setPage(this.page);
      }
    });
  }

  edit(row: any) {
    const ref = this.dialogService.open(ApplicationNewComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: `Chỉnh sửa ứng dụng ${row.nodeName}`,
        data: row
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.setPage(this.page);
      }
    });
  }

  delete(row) {
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      autoFocus: true,
      closeOnBackdropClick: false,
      context: {
        message: `Bạn có chắc chắn muốn xóa thông tin ứng dụng '${row.nodeName}' không?`
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.applicationNodeService.delete(row.id).subscribe(
          () => {
            if (this.page.totalElements - this.page.pageNumber * this.page.size === 1 ) {
              this.page.pageNumber = this.page.pageNumber - 1;
            }
            this.setPage(this.page);
            this.toastrService.success('Xóa thành công', 'Thông báo', {icon: 'checkmark-outline'});
          },
          (error) => {
            this.toastrService.danger(error.error.title, 'Lỗi', {icon: 'alert-triangle-outline'});
          }
        );
      }
    });
  }


}

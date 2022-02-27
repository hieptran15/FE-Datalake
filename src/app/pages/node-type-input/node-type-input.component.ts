import {Component, OnInit} from '@angular/core';

import {Page} from '../../@core/model/page.model';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {ConfirmDialogComponent} from '../../share/component/confirm-dialog/confirm-dialog.component';
import {NodeTypeInputService} from '../../services/node-type-input.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAX_SAFE_INTEGER} from '../../share/common.constant';
import {CatItemService} from '../../services/cat-item.service';
import {NodeTypeInputNewComponent} from './new/node-type-input-new.component';

@Component({
  selector: 'ngx-node-type-input',
  templateUrl: './node-type-input.component.html',
  styleUrls: ['./node-type-input.component.scss'],
})
export class NodeTypeInputComponent implements OnInit {
  columns = [
    {name: 'STT', prop: 'id', flexGrow: 0.5},
    {name: 'Tên trường', prop: 'fieldName', flexGrow: 3},
    {name: 'Tên hiển thị', prop: 'label', flexGrow: 3},
    {name: 'Loại control', prop: 'inputType', flexGrow: 2},
    {name: 'Mô tả', prop: 'description', flexGrow: 3},
    {name: 'Hành động', prop: 'action_btn', flexGrow: 2},
  ];
  page = new Page();
  nodeTypes: any[] = new Array<any>();
  inputs: any[] = new Array<any>();
  searchForm: FormGroup = this.fb.group({
    keyword: null,
    nodeType: null
  })

  constructor(
    private nodeTypeInputService: NodeTypeInputService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private catItemService: CatItemService,
    private fb: FormBuilder) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    this.catItemService.query({
      categoryCodes: ['NODE_TYPE'],
      size: MAX_SAFE_INTEGER,
      page: 0,
      sort: ['itemName', 'id,desc']
    }).subscribe(res => {
      if (res) {
        this.nodeTypes = res.body || [];
      }
    });
    this.setPage({offset: 0});
  }

  setPage(pageInfo?) {
    const pageToLoad: number = pageInfo.offset || pageInfo.pageNumber;

    this.nodeTypeInputService.query({
      keyword: this.searchForm.value.keyword,
      nodeType: this.searchForm.value.nodeType,
      page: pageToLoad,
      size: 10,
    }).subscribe(res => {
      this.page.totalElements = Number(res.headers.get('X-Total-Count'));
      this.page.pageNumber = pageToLoad || 0;
      this.inputs = res.body || [];
    });
  }

  addNew() {
    const ref = this.dialogService.open(NodeTypeInputNewComponent, {
      closeOnBackdropClick: false,
      context: {
        title: 'Thêm input'
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.setPage(this.page);
      }
    });
  }

  edit(row: any) {
    const ref = this.dialogService.open(NodeTypeInputNewComponent, {
      closeOnBackdropClick: false,
      context: {
        title: 'Chỉnh sửa input',
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
        message: `Bạn có chắc chắn muốn xóa trường '${row.label}' không?`
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.nodeTypeInputService.delete(row.id).subscribe(
          () => {
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

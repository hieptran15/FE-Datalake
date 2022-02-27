import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef, NbDialogService, NbToastrService} from '@nebular/theme';
import {ApplicationClusterService} from '../../../services/application-cluster.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAX_SAFE_INTEGER} from '../../../share/common.constant';
import {CatItemService} from '../../../services/cat-item.service';
import {NodeTypeInputService} from '../../../services/node-type-input.service';

@Component({
  selector: 'ngx-application-clusters-new',
  templateUrl: './node-type-input-new.component.html',
  styleUrls: ['./node-type-input-new.component.scss'],
})
export class NodeTypeInputNewComponent implements OnInit {

  constructor(
    public ref: NbDialogRef<NodeTypeInputNewComponent>,
    private dialogService: NbDialogService,
    private nodeTypeInputService: NodeTypeInputService,
    private fb: FormBuilder,
    private toastrService: NbToastrService,
    private catItemService: CatItemService) {
  }

  @Input() title: string;
  @Input() data: any = {};
  isSaving = false;
  nodeTypes: any[] = [];
  inputTypes: any[] = [];
  sourceItems: any[] = [];
  editingItems: any[] = [];
  inputFg: FormGroup = this.fb.group({
    id: null,
    nodeType: [null, Validators.required],
    fieldName: [null, [Validators.required, Validators.maxLength(200)]],
    label: [null, [Validators.required, Validators.maxLength(200)]],
    description: [null, Validators.maxLength(500)],
    inputType: [null, Validators.required],
    defaultValue: null,
    source: null,
    isRequired: null,
    priority: null,
    status: null,
    createTime: null,
    createUser: null,
    updateTime: null,
    updateUser: null
  });



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
    this.catItemService.query({
      categoryCodes: ['INPUT_CONTROL'],
      size: MAX_SAFE_INTEGER,
      page: 0,
      sort: ['itemName', 'id,desc']
    }).subscribe(res => {
      if (res) {
        this.inputTypes = res.body || [];
      }
    });
    if (this.data) {
      if (this.data.style) {
        this.data = {...JSON.parse(this.data.style), ...this.data};
      }
      if (this.data.source) {
        this.sourceItems = JSON.parse(this.data.source);
      }
      this.inputFg.patchValue(this.data);
    }
  }

  addSourceItem() {
    const newItem = {
      label: '',
      value: ''
    }
    this.sourceItems = [...this.sourceItems, newItem];
    this.editingItems[this.sourceItems.length - 1] = Object.assign({}, newItem);
    this.editingItems[this.sourceItems.length - 1].new = true;
  }

  editSourceItem(row, rowIdx) {
    this.editingItems[rowIdx] = Object.assign({}, row);
    this.editingItems[rowIdx].new = false;
  }

  saveSourceItem(rowIdx) {
    if ((this.editingItems[rowIdx].value + '').length === 0 || (this.editingItems[rowIdx].label + '').length === 0) {
      this.toastrService.danger('Nhập đầy đủ thông tin', 'Thông báo');
      return;
    }
    this.sourceItems[rowIdx] = {
      label: this.editingItems[rowIdx].label,
      value: this.editingItems[rowIdx].value
    }
    this.sourceItems = [...this.sourceItems];
    this.editingItems[rowIdx] = null;

  }

  removeSourceItem(rowIdx) {
    this.sourceItems.splice(rowIdx, 1);
    this.editingItems.splice(rowIdx, 1);
  }

  cancelEditSourceItem(rowIdx) {
    if (this.editingItems[rowIdx].new) {
      this.editingItems.splice(rowIdx, 1);
      this.sourceItems.splice(rowIdx, 1);
    } else {
      this.editingItems[rowIdx] = null;
    }
  }

  save() {

    if (this.inputFg.invalid) {
      this.toastrService.success('Vui lòng kiểm tra lại dữ liệu', 'Thông báo');
      return;
    }
    const fg = this.inputFg.value;
    if (fg.inputType === 'SELECT' || fg.inputType === 'RADIO') {
      fg.source = JSON.stringify(this.sourceItems);
    }
    fg.isRequired = fg.isRequired ? 1 : 0;
    this.isSaving = true;
    if (this.data.id) {
      this.nodeTypeInputService.update(fg).subscribe(res => {
        this.toastrService.success('Lưu thành công', 'Thông báo');
        this.isSaving = false;
        this.ref.close(true);
      }, err => {
        this.toastrService.danger(err.error.title, 'Thông báo');
        this.isSaving = false;
      });
    } else {
      this.data.id = null;
      this.nodeTypeInputService.create(fg).subscribe(res => {
        this.toastrService.success('Lưu thành công', 'Thông báo');
        this.isSaving = false;
        this.ref.close(true);
      }, err => {
        this.toastrService.danger(err.error.title, 'Thông báo');
        this.isSaving = false;
      });
    }
  }
}

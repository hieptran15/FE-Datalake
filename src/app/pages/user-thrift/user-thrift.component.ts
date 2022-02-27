import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {FormBuilder, Validators} from '@angular/forms';
import {UserThriftService} from '../../@core/mock/user-thrift.service';

@Component({
  selector: 'ngx-user-thrift',
  templateUrl: './user-thrift.component.html',
  styleUrls: ['./user-thrift.component.scss']
})
export class UserThriftComponent implements OnInit {

  @ViewChild('createWpGroup') createWpGroup: TemplateRef<any>;
  @ViewChild('createWpUser') createWpUser: TemplateRef<any>;
  @ViewChild('confirmDelete') confirmDelete: TemplateRef<any>;
  showPassword = false;
  limit = 10;
  limits = [5, 10, 15, 20];
  keySearch = '';
  groupIdDefault: number;
  backupGroupId: number;
  row = [];
  wpStatusWpGroup = [];
  wpStatusWpUser = [];
  listWpUser = [];
  wpGroup = this.fr.group({
    id: [null],
    name: [null, [Validators.required]],
    description: [null],
    groupAccount: [null, [Validators.required]],
    updateAt: [null],
    status: [null]
  })

  wpUser = this.fr.group({
    id: [null],
    wpUserName: [null, [Validators.required]],
    passWord: [null, [Validators.required]],
    groupId: [null, [Validators.required]],
    description: [null],
    phone: [null],
    roleId: [null],
    status: [null],
    userType: [null],
    createAt: [null],
    updateAt: [null],
    ipAddress: [null, [Validators.required, Validators.pattern(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)]],
  })

  dataTable = [];
  columns = [
    {name: 'userThrift.column.user', prop: 'wpUserName', flex: 1, flexGrow: 1},
    {name: 'userThrift.column.ip', prop: 'ipAddress', flex: 1, flexGrow: 1},
    {name: 'userThrift.column.group', prop: 'groupName', flex: 1, flexGrow: 1},
    {name: 'userThrift.column.accountType', prop: 'userType', flex: 1, flexGrow: 1},
    {name: 'userThrift.column.status', prop: 'status', flex: 1, flexGrow: 1},
    {name: 'userThrift.column.createTime', prop: 'createAt', flex: 1, flexGrow: 1},
    {name: 'userThrift.column.updateTime', prop: 'updateAt', flex: 1, flexGrow: 1},
    {name: 'userThrift.column.action', prop: 'actions', flex: 1, flexGrow: 1},
  ];

  constructor(private userService: UserThriftService,
              private translate: TranslateService,
              private toastrService: NbToastrService,
              public dialogService: NbDialogService,
              private fr: FormBuilder) {
  }

  ngOnInit(): void {
    this.getListWpGroup();
  }

  checkListWpUser(wpGroupId: any) {
    if (wpGroupId === null) {
      this.getListWpUser(this.groupIdDefault);
      this.backupGroupId = this.groupIdDefault;
    } else {
      this.backupGroupId = wpGroupId;
      this.getListWpUser(wpGroupId);
    }
  }

  getListWpUser(groupId: any) {
    this.userService.getListWpUser(groupId).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.listWpUser = res.body.results;
        this.dataTable = [...this.listWpUser];
      } else {
        this.toastrService.danger('Loi ', 'Thông báo')
      }
    })
  }

  saveEditWpGroup(ref: any) {
    this.userService.saveOrEditWpGroup(this.wpGroup.value).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success('Cập nhật thanh công', 'Thông báo')
        this.getListWpGroup();
        ref.close();
      } else {
        this.toastrService.danger('Cập nhật thất bại', 'Thông báo')
      }
    }, error => {
      this.toastrService.danger('Lỗi', 'Thông báo')
    })
  }

  saveWpGroup(ref: any) {
    this.userService.saveOrEditWpGroup(this.wpGroup.value).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success('thêm mới thanh công', 'Thông báo')
        this.getListWpGroup();
        ref.close();
      } else {
        this.toastrService.danger('Thêm mới thất bại', 'Thông báo')
      }
    }, error => {
      this.toastrService.danger('Lỗi', 'Thông báo')
    })
  }

  createNewWpGroup() {
    this.wpGroup.reset();
    this.wpGroup.get('status').patchValue(1);
    this.dialogService.open(this.createWpGroup, {context: {title: 'create'}, closeOnBackdropClick: false})
  }

  editWpUser(index: any) {
    this.showPassword = false;
    this.wpUser.get('id').patchValue(this.dataTable[index].id);
    this.wpUser.get('wpUserName').patchValue(this.dataTable[index].wpUserName);
    this.wpUser.get('passWord').patchValue(this.dataTable[index].passWord);
    this.wpUser.get('groupId').patchValue(this.dataTable[index].groupId);
    this.wpUser.get('description').patchValue(this.dataTable[index].description);
    this.wpUser.get('phone').patchValue(this.dataTable[index].phone);
    this.wpUser.get('status').patchValue(this.dataTable[index].status);
    this.wpUser.get('userType').patchValue(this.dataTable[index].userType);
    this.wpUser.get('createAt').patchValue(this.dataTable[index].createAt);
    this.wpUser.get('updateAt').patchValue(this.dataTable[index].updateAt);
    this.wpUser.get('ipAddress').patchValue(this.dataTable[index].ipAddress);
    this.dialogService.open(this.createWpUser, {
      context: {title: 'edit'},
      closeOnBackdropClick: false
    })
  }

  resetPopuUser() {
    this.wpUser.reset();
    this.wpUser.get('status').patchValue(0);
    this.wpUser.get('userType').patchValue(2);
    this.showPassword = false;
  }

  updateWpGroup(obj: any) {
    this.wpGroup.patchValue({
      id: obj.id,
      name: obj.name,
      description: obj.description,
      groupAccount: obj.groupAccount,
      status: obj.status,
    });
    this.dialogService.open(this.createWpGroup, {context: {title: 'edit'}, closeOnBackdropClick: false})
  }

  deleteWpUser(id: number) {
    this.userService.deleteWpUser(id).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.getListWpUser(this.groupIdDefault);
        this.toastrService.success('Xoa thanh công', 'Thông báo')
      } else {
        this.toastrService.danger('Lỗi', 'Xoas Fail');
      }
    })
  }
  getListWpGroup() {
    this.userService.gitListWpGroup().subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.row = res.body.results;
        this.groupIdDefault = res.body.results[0].id;
      } else {
        this.toastrService.danger('Lỗi', 'Lấy data Fail');
      }
    }, error => {
      this.toastrService.danger('Lỗi', 'Lấy data Fail');
    }, () => {
      this.getListWpUser(this.groupIdDefault);
    })
  }

  openPopupCreateWpUser() {
    this.resetPopuUser();
    this.dialogService.open(this.createWpUser, {context: {title: 'create'}, closeOnBackdropClick: false})
  }


  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  filter() {
    this.keySearch = this.keySearch.trim();
    if (this.keySearch !== '') {
      this.dataTable = this.listWpUser.filter(v => v.wpUserName.toLowerCase().indexOf(this.keySearch.toLowerCase()) !== -1 || v.ipAddress.toLowerCase().indexOf(this.keySearch.toLowerCase()) !== -1)
    } else {
      this.dataTable = [...this.listWpUser]
    }
  }

  createNewWpUser(ref) {
    this.userService.createWpUser(this.wpUser.value).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success('thêm mới thanh công', 'Thông báo')
        this.getListWpUser(this.groupIdDefault);
        ref.close();
      } else {
        this.toastrService.danger('Lỗi', 'Thong baos');
      }
    })
  }

  updateWpUser(ref) {
    this.userService.updateWpUser(this.wpUser.value).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success('Cap nhat thanh công', 'Thông báo')
        this.getListWpUser(this.groupIdDefault);
        ref.close();
      } else {
        this.toastrService.danger('Lỗi', 'Thong baos');
      }
    })
  }

}

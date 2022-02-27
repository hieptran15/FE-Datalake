import {Component, OnInit} from '@angular/core';
import {ServerIpTableManageService} from '../../@core/mock/server-ip-table-manage.service';
import {PopupErrorComponent} from '../popup-error/popup-error.component';

import {NbDialogRef, NbDialogService, NbToastrService} from '@nebular/theme';
import {FormBuilder, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {AuthoritiesConstant} from '../../authorities.constant';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-server-ip-table-manage',
  templateUrl: './server-ip-table-manage.component.html',
  styleUrls: ['./server-ip-table-manage.component.scss']
})
export class ServerIpTableManageComponent implements OnInit {
  showPassword = false;
  showPasswordRoot = false;
  field = ''
  keySearch = '';
  isLoading: boolean = true;
  showUserSSH: boolean = false;
  limit = 10;
  limits = [5, 10, 15, 20];
  rows = [];
  dataTable: any;
  columns = [
    {name: 'id', prop: 'id', flex: 0.5},
    {name: 'serverIpTables.column.ip', prop: 'ip', flex: 1},
    {name: 'serverIpTables.column.userSSH', prop: 'userSSH', flex: 1},
    {name: 'serverIpTables.label.status', prop: 'status', flex: 1},
    {name: 'serverIpTables.label.active', prop: 'actions', flex: 1}
  ];
  formServer = this.fr.group(
    {
      id: [null],
      ip: [null, [Validators.required, Validators.pattern(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)]],
      userSSH: [null, [Validators.required, Validators.maxLength(50)]],
      passSSH: [null, [Validators.required, Validators.maxLength(100)]],
      passRoot: [null, [Validators.required, Validators.maxLength(100)]],
      status: [1, [Validators.required]]
    }
  )
  authority = AuthoritiesConstant;

  constructor(
    private shareData: ShareDataBreadcrumbService,
    private serverIpTableManageService: ServerIpTableManageService,
    public dialogService: NbDialogService,
    private toastrService: NbToastrService,
    public translate: TranslateService,
    private fr: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.search();
    this.sendDataTest();
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Access manager',
      groupText: 'Server manager',
      titleChild: 'Server infor',
      urlPage: '/page/server-ip-table-manage',
    })
  }

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  getInputTypeUserSSH() {
    if (this.showUserSSH) {
      return 'text';
    }
    return 'password';
  }

  toggleShowUserSSH() {
    this.showUserSSH = !this.showUserSSH;
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }


  search() {
    this.serverIpTableManageService.doSearch().subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.isLoading = true;
        this.rows = res.body.results;
        this.dataTable = [...this.rows]
      } else {
        this.toastrService.danger(this.translate.instant('error.http.errors'), this.translate.instant('toast.note'));
      }
    }, error => {
      this.isLoading = false;
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.message},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
    })
  }

  resetForm() {
    this.formServer.reset();
    this.formServer.get('ip').patchValue('');
    this.formServer.get('userSSH').patchValue('');
    this.formServer.get('passSSH').patchValue('');
    this.formServer.get('passRoot').patchValue('');
    this.formServer.get('status').patchValue(1);
    this.showPassword = false;
    this.showPasswordRoot = false;
    this.showUserSSH = false;
  }

  saveEdit(ref) {
    this.serverIpTableManageService.save(this.formServer.value, this.formServer.value.id).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('serverIpTables.success.editSuccess'), this.translate.instant('toast.note'));
        ref.close();
        this.resetForm();
        this.search();
      } else {
        this.toastrService.danger(this.translate.instant('serverIpTables.fail.editFail'), this.translate.instant('toast.note'));
      }
    }, error => {
      this.isLoading = false;
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.message},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
    })
  }

  save(ref) {
    this.serverIpTableManageService.save(this.formServer.value, this.formServer.value.id).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('serverIpTables.success.addSuccess'), this.translate.instant('toast.note'));
        ref.close();
        this.resetForm();
        this.search();
      } else {
        this.toastrService.danger(this.translate.instant('serverIpTables.fail.addFail'), this.translate.instant('toast.note'));
      }
    }, error => {
      this.isLoading = false;
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.message},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
    })
  }

  delete(id: any) {
    this.serverIpTableManageService.delete(id).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('serverIpTables.success.deleteSuccess'), this.translate.instant('toast.note'));
        this.search();
      } else {
        this.toastrService.danger(this.translate.instant('serverIpTables.fail.deleteFail'), this.translate.instant('toast.note'));
      }
    })
  }

  edit(index: any) {
    this.formServer.get('id').patchValue(this.dataTable[index].id);
    this.formServer.get('ip').patchValue(this.dataTable[index].ip);
    this.formServer.get('userSSH').patchValue(atob(this.dataTable[index].userSSH));
    this.formServer.get('passSSH').patchValue(atob(this.dataTable[index].passSSH));
    this.formServer.get('passRoot').patchValue(atob(this.dataTable[index].passRoot));
    this.formServer.get('status').patchValue(this.dataTable[index].status);
    this.showPassword = false;
    this.showPasswordRoot = false;
    this.showUserSSH = false;
  }

  unLockOrLock(index: any, sta: any, ref: NbDialogRef<any>) {
    this.serverIpTableManageService.updateStatus(sta, this.dataTable[index].id).subscribe(res => {
        if (res.responseType === 'SUCCESS') {
          this.toastrService.success(this.translate.instant('success.http.editSuccess'), this.translate.instant('toast.note'));
          this.search();
          ref.close();
        } else {
          this.toastrService.danger(this.translate.instant('success.http.editFail'), this.translate.instant('toast.note'));
          ref.close();
        }
      }
    )
  }

  getInputTypeRoot() {
    if (this.showPasswordRoot) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPasswordRoot() {
    this.showPasswordRoot = !this.showPasswordRoot;
  }

  fillter() {
    this.keySearch = this.keySearch.trim();
    if (this.keySearch !== '') {
      this.dataTable = this.rows.filter(v => v.ip.toLowerCase().indexOf(this.keySearch.toLowerCase()) !== -1 || v.userSSH.toLowerCase().indexOf(this.keySearch.toLowerCase()) !== -1)
    } else {
      this.dataTable = [...this.rows]
    }
  }
}

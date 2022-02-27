import {Component, OnInit} from '@angular/core';
import {RoleManagementService} from '../../services/role-management.service';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {FormBuilder, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {AuthoritiesConstant} from '../../authorities.constant';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  columns = [
    {name: 'Stt', prop: 'stt', flexGrow: 0.5},
    {name: 'user-hdfs.column.name', prop: 'hdfsUser', flexGrow: 1},
    {name: 'user-hdfs.column.description', prop: 'description', flexGrow: 1},
    {name: 'user-hdfs.column.action', prop: 'action', flexGrow: 0.8, center: true}
  ];
  limits = [5, 10, 15, 20];
  limit = 10;
  count = 0;
  isLoading: boolean = false
  listHdfsUser = [];
  listPermission = [];
  searchText = '';
  authority = AuthoritiesConstant;
  formGroup = this.fb.group({
    id: [null],
    hdfsUser: ['', Validators.required],
    description: [''],
    permissions: [[]],
  })

  constructor(
    private roleService: RoleManagementService,
    public dialogService: NbDialogService,
    private shareData: ShareDataBreadcrumbService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastrService: NbToastrService
  ) {
  }

  ngOnInit(): void {
    this.sendDataTest();
    this.query();
    this.getListRole();

  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Utility',
      groupText: 'HDFS Tools',
      titleChild: 'User HDFS manager',
      urlPage: '/page/role-management',
    })
  }

  query(): void {
    this.isLoading = true
    const params = this.searchText ? {hdfsUser: this.searchText} : null;
    this.roleService.query(params).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.isLoading = false
        this.listHdfsUser = res.body.results.map(user => {
          user.hdfsUser.permissionText = user.permissionDtos.map(permission => permission.code).join(', ');
          user.hdfsUser.permissions = user.permissionDtos.map(permission => permission.permissionId);
          return user.hdfsUser;
        });
      }
      console.log(this.listHdfsUser, 'role management query');
    })
  }

  getListRole(): void {
    this.roleService.getListPermission().subscribe(res => {
      this.listPermission = res.body.results;
    })
  }

  openAddorEditDialog(ref: any, data?: any): void {
    data && this.formGroup.patchValue({
      id: data.id,
      hdfsUser: data.hdfsUser,
      description: data.description,
      permissions: data.permissions,
    });
    this.dialogService.open(ref, {context: data, closeOnBackdropClick: false}).onClose.subscribe(_ => {
      this.formGroup.reset()
    })
  }

  save(ref): void {
    console.log(this.formGroup.value, this.listPermission)
    const listPermission = [];
    this.listPermission.forEach(permission => {
      this.formGroup.value.permissions.forEach(p => {
        if (+p === +permission.id) {
          listPermission.push(permission);
        }
      })
    });
    console.log(listPermission);
    this.formGroup.value.id ? this.roleService.update({
      ...this.formGroup.value,
      permissions: listPermission
    }).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('success.http.updateUseHdfsSuccess'), this.translate.instant('success.http.notify'));
        this.query();
        ref.close();
      } else {
        this.toastrService.danger(this.translate.instant('success.http.updateUseHdfsFail'), this.translate.instant('success.http.notify'));
        ref.close();
      }
    }) : this.roleService.create({...this.formGroup.value, permissions: listPermission}).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('success.http.addUseHdfsSuccess'), this.translate.instant('success.http.notify'));
        this.query();
        ref.close();
      } else {
        this.toastrService.danger(this.translate.instant('success.http.addUseHdfsFail'), this.translate.instant('success.http.notify'));
        ref.close();
      }
    })
  }

  delete(id): void {
    this.roleService.delete(id).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('success.http.deleteUseHdfsSuccess'), this.translate.instant('success.http.notify'));
        this.query()
      } else {
        this.toastrService.danger(this.translate.instant('success.http.deleteUseHdfsFail'), this.translate.instant('success.http.notify'));
      }
    })
  }

  geTotalPages(rowCount, curPage) {
    return ((curPage - 1) * this.limit + this.limit + 1) - ((curPage - 1) * this.limit + 1);
  }

  getTotalPage(rowCount, pageSize) {
    return Math.ceil(rowCount / pageSize);
  }
}

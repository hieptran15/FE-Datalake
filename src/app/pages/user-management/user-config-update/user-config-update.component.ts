import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {User, WpIp} from '../../../@core/user/user.model';
import {UserService} from '../../../@core/user/user.service';
import {NbDialogRef, NbDialogService, NbToastrService} from '@nebular/theme';
import {AccounttService} from '../../../@core/account/accountt.service';
import {RoleManagerService} from '../../../services/role-manager.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ngx-user-config-update',
  templateUrl: './user-config-update.component.html',
  styleUrls: ['./user-config-update.component.scss']
})
export class UserConfigUpdateComponent implements OnInit {
  @ViewChild('createWpIp') createWpIp: TemplateRef<any>;
  user: User;
  listWpIpEdit: WpIp[] = [];
  authorities: any[];
  currentTheme: any = 'dark';
  nameUser: string;
  rows = [];
  columns = [
    {name: 'user.column.module', prop: 'moduleName', flexGrow: 1},
    {name: 'user.column.role2', prop: 'codeArr', flexGrow: 1},
    {name: 'user.column.actions', prop: 'action_btn', flexGrow: 0.3},
  ]
  listModule = [];
  listRole = [];
  listBroweseUserHdfs = [];
  listUserHdfsId = [];
  listWpGroup = [];
  isUserHdfs;
  selectedRole: any;
  selectedHdfs: any;
  listRoleGroup = [];
  listWpIpdelete = [];
  ipForm: FormGroup = this.fb.group({
    ipAddress: [null, Validators.pattern(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/)],
  });
  formGroup = this.fb.group({
    moduleId: [null],
    userHdfsId: [null],
    groupId: [null, Validators.required],
    phoneNumber: [null],
    typeUser: [null, Validators.required],
    ipAddress: [null],
    RoleGroup: [null],
    Hdfs: [null],
    listDPermission: [null]
  });

  constructor(private fb: FormBuilder,
              protected router: Router,
              private accounttService: AccounttService,
              private userService: UserService,
              public dialogService: NbDialogService,
              private toastrService: NbToastrService,
              private roleServices: RoleManagerService,
              private translate: TranslateService,
              public ref: NbDialogRef<UserConfigUpdateComponent>
  ) {
  }

  ngOnInit() {
    console.log(this.user)
    this.getListWpGroup();
    this.selectedRole = this.user?.authorities[0]?.id;
    this.getUser();
    this.getListModule();
    this.getHdfsUser();
    this.getBroweseUserHdfs();
    this.getAllRoleGroup();
    this.listWpIpdelete = [];
    this.listWpIpEdit = this.user.listWpIp;
    this.nameUser = this.user.login;
    this.formGroup.get('groupId').patchValue(this.user.groupId);
    this.formGroup.get('typeUser').patchValue(this.user.typeUser);
    this.formGroup.get('phoneNumber').patchValue(this.user.phoneNumber);
    this.formGroup.get('ipAddress').patchValue(this.user.ips);
    this.formGroup.get('moduleId').valueChanges.subscribe(value => {
      this.listRole = [];
      this.formGroup.get('userHdfsId').reset();
      this.formGroup.get('listDPermission').reset();
      if (value) {
        this.accounttService.getListRole(value).subscribe(res => {
          if (res) this.listRole = res;
        });
        if (value === 2) {
          this.formGroup.get('userHdfsId').setValidators([Validators.required]);
          this.formGroup.get('userHdfsId').updateValueAndValidity();
        } else {
          this.formGroup.get('userHdfsId').clearValidators();
          this.formGroup.get('userHdfsId').updateValueAndValidity();
        }
      } else this.listRole = [];
    })
    this.formGroup.get('userHdfsId').valueChanges.subscribe(value => {
      this.formGroup.get('listDPermission').reset();
      if (value) {
        this.accounttService.getListRoleByHDFS(value, this.user.id).subscribe(res => {
          const listRoleId = [];
          res && res.forEach(a => {
            listRoleId.push(a.id);
          })
          this.formGroup.get('listDPermission').patchValue(listRoleId);
        });
      }
    })
  }

  getListWpGroup() {
    this.userService.gitListWpGroup().subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.listWpGroup = res.body.results;
      } else {
        this.toastrService.danger('Lỗi', 'Lấy data Fail');
      }
    }, error => {
      this.toastrService.danger('Lỗi', 'Lấy data Fail');
    });
  }

  getBroweseUserHdfs(): void {
    this.accounttService.getBroweseUserHdfs({}).subscribe((res) => {
      this.listBroweseUserHdfs = res?.results;
      if (this.user?.dHdfsUsers.length !== 0) {
        const b = this.user?.dHdfsUsers.map((value) => {
          return value.id
        })
        this.selectedHdfs = b;
      } else {
        const hdfsDefault = res?.results.filter(e => e.hdfsUser?.hdfsUser === 'vbi_app');
        this.selectedHdfs = [hdfsDefault[0]?.hdfsUser?.id]
      }
    })
  }

  getAllRoleGroup(): void {
    this.roleServices.getAllRoleGroup({}).subscribe((res) => {
      this.listRoleGroup = res.body.results
    })
  }

  getUser(): void {
    this.accounttService.getUser(this.user.id).subscribe(res => {
      if (res && res.authorities) {
        this.isUserHdfs = res.userHdfs;
        const listModuleId = new Set();
        const result = [];
        res.authorities.forEach(authority => {
          listModuleId.add(authority.moduleId);
        });
        listModuleId.forEach(moduleId => {
          const temp = {
            moduleName: res.authorities.find(authority => authority.moduleId === moduleId).moduleName,
            moduleId: moduleId,
            listDPermission: [],
            codeArr: [],
            userHdfsId: res.authorities.find(authority => authority.moduleId === moduleId)['userHdfsId'],
          };
          res.authorities.forEach(authority => {
            if (authority.moduleId === moduleId) {
              temp.listDPermission.push(authority.permissionId);
              temp.codeArr.push(authority.userHdfsName ? authority.userHdfsName + '_' + authority.code + ' ' : authority.code + ' ');
            }
          })
          result.push(temp);
        })
        this.rows = result;
      }

    })
  }

  getListModule(): void {
    this.accounttService.getModule(this.user.id).subscribe(res => {
      if (res) {
        this.listModule = res;
        if (!this.isUserHdfs) this.listModule = this.listModule.filter(module => module.moduleId !== 2);
      }
    });
  }

  getHdfsUser(): void {
    this.accounttService.getHdfsUser(this.user.id).subscribe(res => {
      if (res) this.listUserHdfsId = res;
      else this.listUserHdfsId = [];
    })
  }

  editRole(template, row) {
    this.dialogService.open(template, {context: row});
    this.accounttService.getListRole(row.moduleId).subscribe(res => {
      if (res) this.listRole = res;
    });
    this.formGroup.reset();
    this.formGroup.patchValue({
      moduleId: row.moduleId,
      userHdfsId: row.userHdfsId,
      listDPermission: row.listDPermission
    });
  }

  save(ref, data): void {
    if (!data) {
      this.accounttService.addRole({
        ...this.formGroup.value,
        userHdfs: this.formGroup.value.userHdfsId ? 1 : 0,
        userId: this.user.id
      }).subscribe(res => {
        this.toastrService.success(this.translate.instant('success.http.addSuccess'), this.translate.instant('success.http.notify'));
        this.getUser();
        this.getListModule();
        ref.close();
      }, error => {
        this.toastrService.danger(error.error.message, this.translate.instant('success.http.notify'));
        ref.close();
      })
    } else {
      this.accounttService.updateRole({
        ...this.formGroup.value,
        userHdfs: this.formGroup.value.userHdfsId ? 1 : 0,
        userId: this.user.id
      }).subscribe(res => {
        this.toastrService.success(this.translate.instant('success.http.editSuccess'), this.translate.instant('success.http.notify'));
        this.getUser();
        this.getListModule();
        ref.close();
      }, error => {
        this.toastrService.danger(error.error.message, this.translate.instant('success.http.notify'));
        ref.close();
      })
    }
  }

  delete(ref, data) {
    this.accounttService.deleteRole({moduleId: data.moduleId, userId: this.user.id}).subscribe(res => {
      this.toastrService.success(this.translate.instant('success.http.deleteSuccess'), this.translate.instant('success.http.notify'));
      this.getUser();
      this.getListModule();
      ref.close();
    }, error => {
      this.toastrService.danger(error.error.message, this.translate.instant('success.http.notify'));
      ref.close();
    })
  }

  addRoleGroup(ref) {
    const option = {
      userId: this.user.id,
      userHdfsId: this.selectedHdfs,
      typeUser: this.formGroup.value.typeUser,
      groupId: this.formGroup.value.groupId,
      phoneNumber: this.formGroup.value.phoneNumber,
      ipAddress: this.listWpIpEdit,
      listWpIpDelete: this.listWpIpdelete,
    }
    this.accounttService.updateRoleGroup({roleName: this.selectedRole, option}).subscribe((res) => {
        this.toastrService.success(this.translate.instant('success.http.editSuccess'), this.translate.instant('success.http.notify'));
        ref.close();
        this.selectedHdfs = []
      },
      error => {
        this.toastrService.danger(error.error.message, this.translate.instant('success.http.notify'));
        ref.close();
      })
  }

  addIpAddress(dgRef, ipAddress: any, edittingIndex?: number) {
    let backUpList = [];
    let count = 0;
    if (edittingIndex || edittingIndex === 0) {
      backUpList = [...this.listWpIpEdit];
      backUpList.splice(edittingIndex, 1)
      backUpList.forEach(obj => {
        if (obj.ipAddress === ipAddress) {
          count++;
        }
      });
      if (count !== 0) {
        this.toastrService.danger(this.translate.instant('error.http.duplicateIpAddress'), this.translate.instant('toast.note'));
      } else {
        this.listWpIpEdit[edittingIndex].ipAddress = ipAddress;
        dgRef.close();
      }
    } else {
      this.listWpIpEdit.forEach(obj => {
        if (obj.ipAddress === ipAddress) {
          count++;
        }
      });
      if (count !== 0) {
        this.toastrService.danger(this.translate.instant('error.http.duplicateIpAddress'), this.translate.instant('toast.note'));
      } else {
        const wpIp: WpIp = new WpIp();
        console.log(wpIp)
        wpIp.ipAddress = ipAddress;
        this.listWpIpEdit.push(wpIp);
        dgRef.close();
      }
    }
    console.log(this.listWpIpEdit)
  }

  openPopupEditIp(i: number) {
    this.ipForm.get('ipAddress').patchValue(this.listWpIpEdit[i].ipAddress)
    this.dialogService.open(this.createWpIp, {closeOnBackdropClick: false, context: {index: i}});
  }

  openPopupCreateIp() {
    this.ipForm.get('ipAddress').patchValue(null);
    this.dialogService.open(this.createWpIp, {closeOnBackdropClick: false});
  }

  deleteIpAddress(index: any) {
    this.listWpIpdelete.push(this.listWpIpEdit[index].id);
    this.listWpIpEdit.splice(index, 1);
  }
}

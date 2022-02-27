import {Component, HostListener, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {RoleManagerService} from '../../services/role-manager.service';
import {TranslateService} from '@ngx-translate/core';
import {AccountService} from '../../@core/auth/account.service';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-role-manager',
  templateUrl: './role-manager.component.html',
  styleUrls: ['./role-manager.component.scss']
})
export class RoleManagerComponent implements OnInit {
  @ViewChild('confirmDelete') confirmDelete: TemplateRef<any>
  role = 'role';
  roleNames;
  isLoading: boolean = false;
  isLoadingRole: boolean = false;
  isLoadingRoleUser: boolean = false;
  listPermission = [];
  listModule = [];
  allUserRoleGroup = [];
  listModuleCheck = [];
  listAllRoleGroup = [];
  nameGroup: string;
  moduleId: number;
  description: string;
  moduleName: string;
  codeRole: string
  removecheck: boolean
  resoleRole = [];
  checkActive: string;
  checkActiveId: any;
  CheckModule: [];
  getAddModule = []
  regexNameRole = /^[^!#$%^=()+~&*@,/';<>.?|:"`{}-]*$/;

  constructor(public dialogService: NbDialogService,
              private shareData: ShareDataBreadcrumbService,
              private roleServices: RoleManagerService,
              private toastrService: NbToastrService,
              private translate: TranslateService,
              private accountService: AccountService,
  ) {
  }

  ngOnInit(): void {
    this.sendDataTest();
    this.getPermissionsDefaults();
    this.getAllRoleGroup();
    this.searchModule();
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Setting',
      titleChild: 'Role manager',
      urlPage: '/page/role-manager',
    })
  }

  getPermissionsDefaults()
    :
    void {
    this.roleServices.getPermissionsDefault({}).subscribe((res) => {
      this.listPermission = res.body.results;
      const a = this.listPermission.map((x) => {
        return x.code
      })
    })
  }

  getSearchModuleGroup()
    :
    void {
    this.roleServices.searchModuleGroup({}).subscribe((res) => {
      this.listModule = res.body.results;
    })
  }

  getAllRoleGroup()
    :
    void {
    this.isLoadingRole = true
    this.roleServices.getAllRoleGroup({}).subscribe((res) => {
      this.listAllRoleGroup = res.body.results;
      this.checkActive = res.body.results[0]?.name;
      this.roleManagerDefault(res.body.results[0]?.id, this.checkActive);
      this.isLoadingRole = false;
    })
  }

  searchModule()
    :
    void {
    this.roleServices.searchModule({}).subscribe((res) => {
      this.CheckModule = res.body.results;
    })
  }

  roleManager(item) {
    this.isLoading = true
    this.checkActive = item?.name;
    this.checkActiveId = item?.id;
    this.roleServices.searchModuleGroup({roleId: item?.id}).subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        this.listModuleCheck = res.body.results
        this.listModule = res.body.results;
        this.listModule.map(((e: any) => {
            const check = e.permissions.find(obj => obj.value === '1')
            e.isChecked = check ? true : false
            return e
          }
        ))
        this.isLoading = false
      } else {
        this.isLoading = false;
      }
    }, (error) => {
      this.isLoading = false
    })
  }

  roleManagerDefault(checkActiveId, checkActive) {
    this.isLoadingRole = false;
    if (!this.nameGroup) {
      this.checkActiveId = checkActiveId
    } else {
      const ids = this.listAllRoleGroup.filter(e => e.name === this.nameGroup)[0]?.id;
      if (!ids) {
        this.checkActiveId = checkActiveId;
        this.checkActive = checkActive;
      } else {
        this.checkActiveId = ids;
        this.checkActive = this.nameGroup;
      }
    }
    console.log(this.checkActiveId);
    console.log(this.checkActive);
    this.roleServices.searchModuleGroup({roleId: this.checkActiveId}).subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        this.listModuleCheck = res.body.results
        this.listModule = res.body.results;
        this.listModule.map(((e: any) => {
            const check = e.permissions.find(obj => obj.value === '1')
            e.isChecked = check ? true : false
            return e
          }
        ))
      }
    }, (error) => {
      console.log(error)
    }, () => {
      this.nameGroup = ''
    })
  }

  addNewGroup(ref) {
    this.roleServices.addRoleGroup({name: this.nameGroup.trim()}).subscribe((res) => {
      if (res.responseType === 'SUCCESS') {
        this.toastrService.success('Add role group success', this.translate.instant('success.http.notify'));
        this.getAllRoleGroup()
        ref.close();
      } else {
        this.toastrService.danger(res?.message, this.translate.instant('success.http.notify'));
        ref.close();
        this.nameGroup = ''
      }
    })
  }

  checked(item) {
    this.moduleId = item?.moduleId
    this.description = item?.description
    this.moduleName = item?.moduleName;
    this.getAddModule = item.permissions;
  }

  checkedAddRole($event
                   :
                   any, item
                   :
                   any, index
  ) {
    this.codeRole = item?.code;
    this.removecheck = $event
    if ($event) {
      this.getAddModule[index]['value'] = '1';
      this.resoleRole = this.getAddModule;
    } else {
      this.resoleRole = [...this.getAddModule].filter(x => x !== item);
      this.getAddModule[index]['value'] = '0';
      this.resoleRole = this.getAddModule;
    }
  }

  updateModuleGroup(ref) {
    const a = [];
    this.resoleRole.forEach(i => {
      if (i['value'] === '1') {
        a.push(i)
      }
    })
    const option = {
      moduleId: this.moduleId,
      moduleName: this.moduleName,
      description: this.description,
      permissions: a
    }
    this.roleServices.updateModuleGroup({nameGroup: this.checkActiveId, option}).subscribe((res) => {
      if (res.responseType === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('success.http.updateModuleSuccess'), this.translate.instant('success.http.notify'));
        this.reloadRoleUpdate()
        this.resoleRole = []
        ref.close();
      } else {
        this.toastrService.danger(this.translate.instant('success.http.updateModuleFail'), this.translate.instant('success.http.notify'));
        this.resoleRole = []
        ref.close();
      }
    })
  }

  checkedAddModule($event
                     :
                     boolean, value
  ) {
    console.log($event)
    console.log(value)
  }

  reloadRoleUpdate() {
    this.roleServices.searchModuleGroup({roleId: this.checkActiveId}).subscribe((res1) => {
      this.listModule = res1.body.results;
      if (res1.body.responseType === 'SUCCESS') {
        this.listModule = res1.body.results;
        this.listModule.map(((e: any) => {
            const check = e.permissions.find(obj => obj.value === '1')
            e.isChecked = check ? true : false
            return e
          }
        ))
      }
    })
  }

  cancel(ref) {
    this.resoleRole = [];
    this.removecheck = false
    ref.close();
  }

  searchTextModule(value
                     :
                     any
  ) {
    if (value.target.value !== '') {
      this.listModule = this.listModuleCheck.filter(v => v.moduleName.toLowerCase().indexOf(value.target.value.trim().toLowerCase()) !== -1)
    } else {
      this.listModule = this.listModuleCheck
    }
  }

  deleteRoleGroup(ref) {
    this.roleServices.deleteRoleGroup(this.nameGroup).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('Delete role group success'), this.translate.instant('toast.note'))
        this.getAllRoleGroup();
        ref.close();
      } else {
        this.toastrService.danger(res.body.message, this.translate.instant('toast.note'));
        ref.close();
      }
    })
  }

  pupupDeleteRoleGroup(item
                         :
                         any
  ) {
    this.nameGroup = item?.name;
    this.isLoadingRoleUser = true;
    this.roleServices.getUserRoleGroup(item?.name).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.allUserRoleGroup = res.body.results;
        this.isLoadingRoleUser = false;
      } else {
        this.toastrService.danger(res.body.message, this.translate.instant('toast.note'));
        this.isLoadingRoleUser = false;
      }
    }, (error) => {
      this.toastrService.danger('Fail', this.translate.instant('toast.note'));
      this.isLoadingRoleUser = false;
    })
    this.dialogService.open(this.confirmDelete, {
      context: {
        title: 'delete',
        name: item?.name,
        closeOnBackdropClick: false
      }
    })
  }

  trackByFn(index, item) {
    return index;
  }

  editRoleGroup(item
                  :
                  any
  ) {
    this.nameGroup = item?.name;
  }

  updateRoleGroup(ref, items: any) {
    const option = {
      id: items?.id,
      name: this.nameGroup.trim()
    }
    this.roleServices.updateRoleGroup(option).subscribe(res => {
      if (res.responseType === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('Update role group success'), this.translate.instant('toast.note'));
        this.getAllRoleGroup();
        ref.close();
      } else {
        this.toastrService.danger(res.message, this.translate.instant('toast.note'));
        this.isLoadingRoleUser = false;
        ref.close();
      }
    }, () => {
      this.toastrService.danger('Fail', this.translate.instant('toast.note'));
      ref.close();
    })
  }

  resetAddRole() {
    this.nameGroup = '';
  }

  onKeyPress(event: any, regex: any): void {
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }
}

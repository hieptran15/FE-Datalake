import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Page} from '../../../@core/model/page.model';
import {UserService} from '../../../@core/user/user.service';
import {Router} from '@angular/router';
import {HttpHeaders} from '@angular/common/http';
import {IUser, User} from '../../../@core/user/user.model';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {UserConfigUpdateComponent} from '../user-config-update/user-config-update.component';
import {ConfirmDialogComponent} from '../../../share/component/confirm-dialog/confirm-dialog.component';
import {LanguageService} from '../../../@core/mock/language.service';
import {AuthoritiesConstant} from '../../../authorities.constant';
import {RoleManagerService} from '../../../services/role-manager.service';
import {AccounttService} from '../../../@core/account/accountt.service';
import {ShareDataBreadcrumbService} from '../../../services/share-data-breadcrumb.service';


@Component({
  selector: 'ngx-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit, AfterViewInit {
  @ViewChild('createWpGroup') createWpGroup: TemplateRef<any>;
  @ViewChild('addUser') addUser: TemplateRef<any>;
  @ViewChild('confirmDelete') confirmDelete: TemplateRef<any>;
  page = new Page();
  showPassword = false;
  showPasswordCf = false;
  listRoleGroup = [];
  listBroweseUserHdfs = [];
  listWpGroup = [];
  groupIdDefault: any;
  selectedHdfs: any;
  users?: User[] = new Array<User>();
  columns = [
    {name: 'user.column.index', prop: 'index', flexGrow: 0.3},
    {name: 'user.column.userName', prop: 'login', flexGrow: 0.5},
    {name: 'Ip', prop: 'ips', flexGrow: 0.6},
    {name: 'user.column.group', prop: 'wpGroupEntity.name', flexGrow: 0.5},
    {name: 'user.column.type', prop: 'typeUser', flexGrow: 0.5},
    // {name: 'user.column.status', prop: 'activated', flexGrow: 0.5},
    {name: 'user.column.role', prop: 'authoritiesName', flexGrow: 0.5},
    {name: 'user.column.active', prop: 'action_btn', flexGrow: 0.7}
  ];
  currentTheme: any = 'dark';
  isLoading: boolean = false;
  limits = [5, 10, 15, 20];
  limit = 10;
  data: IUser[];
  userForm: FormGroup = this.fb.group({
    authority: [null],
    keyword: [null],
    selectUserName: ['', Validators.required],
    password: [null, Validators.required],
    Repassword: [null],
    fullName: [null],
    selectedEmail: [null, Validators.required],
    groupId: [null, Validators.required],
    ipAddress: [[]],
    typeUser: [0, Validators.required],
    phoneNumber: [null, Validators.pattern(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)],
    selectedRoleGroup: [null, Validators.required],
    selectedHdfs: [[]]
  });

  wpGroup: FormGroup = this.fb.group({
    id: [null],
    name: [null, [Validators.required, Validators.maxLength(100)]],
    description: [null, [Validators.maxLength(100)]],
    groupAccount: [null, [Validators.required, Validators.maxLength(100)]],
    updateAt: [null],
    activated: [null]
  });
  ipForm: FormGroup = this.fb.group({
    ipAddress: [null, Validators.pattern(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/)],
  });
  authority = AuthoritiesConstant;
  authorities: any[];
  searchActive: boolean;

  constructor(public userService: UserService,
              public dialogService: NbDialogService,
              private fb: FormBuilder,
              private roleServices: RoleManagerService,
              private translate: TranslateService,
              private shareData: ShareDataBreadcrumbService,
              private toastrService: NbToastrService,
              private accounttService: AccounttService,
              private languageService: LanguageService,
              private router: Router) {
    this.page.pageNumber = 0;
    this.page.size = this.limit;
  }

  ngOnInit() {
    this.sendDataBreadcrumb();
    this.sendDataTest();
    this.userService.authorities().subscribe(authorities => {
      this.authorities = authorities
    });
    // this.catItemServiceService.fetch(CategoryId.DOMAIN).subscribe(domains => {
    //   this.domainData = domains
    // });
    this.getListWpGroup();
    this.setPage(this.page);
    this.getAllRoleGroup();
    this.getBroweseUserHdfs();
  }

  sendDataBreadcrumb() {
    this.shareData.updateData({
      title: 'Setting',
      titleChild: 'User manager',
      urlPage: '/page/user-manager',
    })
  }

  navigateToUserDetails(row: any) {
    this.userService.CurrentUserManagement = row;
    this.router.navigate([`/page/user-management/user/${row.id}`])
  }
  sendDataTest() {
    this.shareData.updateData({
      title: 'Setting',
      titleChild: 'User manager',
      urlPage: '/page/user-management/user',
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
    }, 100);
  }

  getListWpGroup() {
    this.userService.gitListWpGroup().subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.listWpGroup = res.body.results;
      } else {
        this.toastrService.danger(this.translate.instant('error.http.errors'), this.translate.instant('toast.note'));
      }
    });
  }

  addIpAddress(dgRef, ipAddress: any, edittingIndex?: number) {
    let newList = [];
    let backUpList = [];
    if (edittingIndex || edittingIndex === 0) {
      backUpList = [...this.userForm.value.ipAddress];
      backUpList.splice(edittingIndex, 1);
      newList = [...this.userForm.value.ipAddress];
      if (backUpList.includes(ipAddress)) {
        this.ipForm.get('ipAddress').patchValue(ipAddress);
        this.toastrService.danger(this.translate.instant('error.http.duplicateIpAddress'), this.translate.instant('toast.note'));
      } else {
        newList[edittingIndex] = ipAddress;
        this.userForm.get('ipAddress').patchValue(newList);
        dgRef.close();
      }
    } else {
      if (this.userForm.value.ipAddress.includes(ipAddress)) {
        this.ipForm.get('ipAddress').patchValue(ipAddress);
        this.toastrService.danger(this.translate.instant('error.http.duplicateIpAddress'), this.translate.instant('toast.note'));
      } else {
        newList = [...this.userForm.value.ipAddress, ipAddress];
        this.userForm.get('ipAddress').patchValue(newList);
        dgRef.close();
      }
    }
  }

  deleteIpAddress(index: number): void {
    const newList = [...this.userForm.value.ipAddress];
    newList.splice(index, 1);
    this.userForm.get('ipAddress').patchValue(newList)
  }

  getListUserByGroupId(id: number) {
    this.groupIdDefault = id;
    this.setPage({offset: 0});
  }

  getAllRoleGroup(): void {
    this.roleServices.getAllRoleGroup({}).subscribe((res) => {
      this.listRoleGroup = res.body.results
    })
  }

  getBroweseUserHdfs(): void {
    this.accounttService.getBroweseUserHdfs({}).subscribe((res) => {
      this.listBroweseUserHdfs = res?.results;
    })
  }

  search() {
    this.searchActive = true
    this.setPage({offset: 0});
  }

  setPage(pageInfo) {
    this.page.size = this.limit;
    const pageToLoad: number = pageInfo.offset;
    this.isLoading = true;
    this.userService.query({
      keyword: this.searchActive ? this.userForm.value.keyword : '',
      authority: this.searchActive ? this.userForm.value.authority : '',
      groupId: this.groupIdDefault ? this.groupIdDefault : '',
      page: pageToLoad,
      size: this.page.size
    }).subscribe(res => {
      this.onSuccess(res.body, res.headers, pageToLoad)
    });
  }

  openPopupAddUser() {
    this.resetForm();
    this.dialogService.open(this.addUser, {context: {title: 'create'}, closeOnBackdropClick: false})
  }

  edit(row) {
    const dialogUpdate = this.dialogService.open(UserConfigUpdateComponent, {
      context: {
        user: row,
      },
      closeOnBackdropClick: false
    }).onClose.subscribe(data => {
      this.setPage(this.page);
      if (data && data.result === 'complete') {
        this.search();
      }
    });
    // dialogUpdate.onClose.subscribe(data => {
    //
    // });
  }


  // new() {
  //   const dialogNew = this.dialogService.open(UserConfigUpdateComponent, {
  //     context: {},
  //   });
  //   dialogNew.onClose.subscribe(data => {
  //     if (data.result !== undefined && 'complete' === data.result) {
  //       this.search();
  //     }
  //   });
  // }

  resetPassword(user) {
    const dialog = this.dialogService.open(ConfirmDialogComponent, {
      autoFocus: true,
      context: {
        message: this.translate.instant('user.label.changePass')
      },
      closeOnBackdropClick: false
    });
    dialog.onClose.subscribe(res => {
      if (res) {
        this.userService.resetPass(user?.id).subscribe(() => {
          this.toastrService.success(this.translate.instant('toast.resetPassWordSuccess'), this.translate.instant('toast.note'));
          this.setPage(this.page);
        })
      }
    });
  }

  setActive(user, isActivated) {
    this.dialogService.open(ConfirmDialogComponent, {
      autoFocus: true,
      context: {
        message: this.translate.instant('user.label.changeStatus')
      },
      closeOnBackdropClick: false
    }).onClose.subscribe(res => this.onComplete(res, user, isActivated));
  }

  onComplete(res, user, isActivated) {
    if (res) {
      if (isActivated === 2) {
        user.activated = true;
      } else {
        user.status = isActivated;
      }
      this.userService.updateStatus(user).subscribe(
        () => {
          this.toastrService.success(this.translate.instant('user.changeStatusSuccess'), this.translate.instant('toast.note'));
          this.setPage(this.page);
        }
      );
    }
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

  getInputTypeCf() {
    if (this.showPasswordCf) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPasswordCf() {
    this.showPasswordCf = !this.showPasswordCf;
  }

  test() {
    console.log('dag test')
  }

  resetForm() {
    this.userForm.reset();
    this.userForm.get('selectUserName').patchValue('');
    this.userForm.get('selectedHdfs').patchValue([]);
    this.userForm.get('fullName').patchValue(null);
    this.userForm.get('selectedEmail').patchValue(null);
    this.userForm.get('password').patchValue(null);
    this.userForm.get('selectedRoleGroup').patchValue('');
    this.userForm.get('groupId').patchValue(null);
    this.userForm.get('ipAddress').patchValue([]);
    this.userForm.get('typeUser').patchValue(0);
    this.userForm.get('phoneNumber').patchValue(null);
  }

  addNewUser(addUserRef) {
    const option = {
      userName: this.userForm.value.selectUserName,
      dHdfsUsers: this.userForm.value.selectedHdfs,
      firstName: this.userForm.value.fullName,
      email: this.userForm.value.selectedEmail,
      passWord: this.userForm.value.password,
      roleGroup: this.userForm.value.selectedRoleGroup,
      groupId: this.userForm.value.groupId,
      ipAddress: this.userForm.value.ipAddress,
      typeUser: this.userForm.value.typeUser,
      phoneNumber: this.userForm.value.phoneNumber,
    }
    this.userService.addUser(option).subscribe((res) => {
      this.setPage(this.page);
      this.toastrService.success(this.translate.instant('toast.note'), this.translate.instant('toast.note'));
      this.resetForm()
      addUserRef.close()
      this.isLoading = false;
    }, (error) => {
      this.toastrService.danger('error', this.translate.instant('toast.note'));
    })
  }

  protected onSuccess(data: any | null, headers: HttpHeaders, page: number): void {
    this.isLoading = false;
    this.page.totalElements = Number(headers.get('X-Total-Count'));
    this.page.pageNumber = page || 0;
    this.users = data || [];
    this.users.forEach((u: any) => {
      u.authoritiesName = (u.authorities || []).map(a => a.name).sort().join();
      u.listWpIp.forEach((item: any) => {
        u.ips = u.ips === undefined ? item.ipAddress : u.ips + ',' + item.ipAddress;
      })
    })
  }

  selectAllUser() {
    this.groupIdDefault = '';
    const pageToLoad: number = 0;
    this.isLoading = true;
    this.userService.query({
      keyword: this.searchActive ? this.userForm.value.keyword : '',
      authority: this.searchActive ? this.userForm.value.authority : '',
      groupId: this.groupIdDefault,
      page: pageToLoad,
      size: 10
    }).subscribe(res => {
      this.onSuccess(res.body, res.headers, pageToLoad)
    });
  }

  openPopupCreateWpGroup() {
    this.resetWpGreoup();
    this.dialogService.open(this.createWpGroup, {
      context: {
        title: 'create',
        closeOnBackdropClick: false
      }
    })
  }

  openPopupEditWpGroup(item: any) {
    this.wpGroup.get('id').patchValue(item.id),
      this.wpGroup.get('name').patchValue(item.name),
      this.wpGroup.get('description').patchValue(item.description),
      this.wpGroup.get('groupAccount').patchValue(item.groupAccount),
      this.wpGroup.get('activated').patchValue(item.activated),
      this.dialogService.open(this.createWpGroup, {
        context: {
          title: 'edit',
          closeOnBackdropClick: false
        }
      })
  }

  openPopupDeleteWpGroup(item: any) {
    this.wpGroup.get('id').patchValue(item.id);
    this.dialogService.open(this.confirmDelete, {
      context: {
        title: 'delete',
        closeOnBackdropClick: false
      }
    })
  }

  deleteWpGroup(ref) {
    this.userService.deleteWpGroup(this.wpGroup.value.id).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('Delete group success'), this.translate.instant('toast.note'))
        this.getListWpGroup();
        this.selectAllUser();
        ref.close();
      } else {
        this.toastrService.danger(res.body.message, this.translate.instant('toast.note'));
        ref.close();
      }
    })
  }

  resetWpGreoup() {
    this.wpGroup.reset();
    this.wpGroup.get('activated').patchValue(1);
  }

  saveNewWpGroup(ref: any) {
    this.userService.saveOrEditWpGroup(this.wpGroup.value, this.wpGroup.value.id).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('label.createSuccess'), this.translate.instant('toast.note'))
        this.getListWpGroup();
        ref.close();
      } else if (res.body.message === '01') {
        this.toastrService.danger(this.translate.instant('error.http.duplicateName'), this.translate.instant('success.http.notify'));
      } else {
        this.toastrService.danger(this.translate.instant('label.createFail'), this.translate.instant('toast.note'))
      }
    })
  }

  saveEditWpGroup(ref: any) {
    this.userService.saveOrEditWpGroup(this.wpGroup.value, this.wpGroup.value.id).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('label.updateSuccess'), this.translate.instant('toast.note'))
        this.getListWpGroup();
        ref.close();
      } else if (res.body.message === '01') {
        this.toastrService.danger(this.translate.instant('error.http.duplicateName'), this.translate.instant('success.http.notify'));
      } else {
        this.toastrService.danger(this.translate.instant('label.updateFail'), this.translate.instant('toast.note'))
      }
    })
  }
}

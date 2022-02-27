import {RoleManagerService} from '../../../../services/role-manager.service';
import {TranslateService} from '@ngx-translate/core';
import {AccounttService} from '../../../../@core/account/accountt.service';
import {LanguageService} from '../../../../@core/mock/language.service';
import {UserService} from '../../../../@core/user/user.service';
import {AuthoritiesConstant} from '../../../../authorities.constant';
import {User} from '../../../../@core/user/user.model';
import {Component, Input, OnChanges, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ShareDataBreadcrumbService} from '../../../../services/share-data-breadcrumb.service';
import {Router} from '@angular/router';
import {SupportRequestService} from '../../../../services/support-request.service';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {AccountService} from '../../../../@core/auth/account.service';

@Component({
  selector: 'ngx-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  @ViewChild('confirmSendOrSaveSR') confirmSendOrSaveSR: TemplateRef<any>
  @Input() dataItems: any;
  @Input() paramId;
  isLoading: boolean = false;
  valueSearch = '';
  keySearchUser = null;
  listUserHanndlerNew = [];
  formGroupDashboard: any;
  rowData: any[];
  isValidateListReview: boolean = false;
  listUser = [];
  limit = 4;
  listUserEditMapping = [];
  listSrUserMapDelete = [];
  listSrCenSorDelete = [];
  lists = [];
  columnsTable = [
    {name: 'STT', prop: 'stt', flexGrow: 0.5},
    {name: 'Tên nhóm quyền', prop: 'userName', flexGrow: 0.9},
    {name: 'Module', prop: 'Module', flexGrow: 0.9},
    {name: 'Người thêm', prop: 'rpAppName', flexGrow: 0.9},
    {name: 'Ngày thêm', prop: 'result', flexGrow: 0.9},
    {name: 'Action', prop: 'action', flexGrow: 0.8},
  ];
  formGroupInfoGroup: FormGroup = this.fb.group({
    moduleId: [null],
    userHdfsId: [null],
    groupId: [null, Validators.required],
    phoneNumber: [null],
    typeUser: [null, Validators.required],
    RoleGroup: [null],
    Hdfs: [null],
    // listDPermission: [null],
    email: [null],

    userName: [null, Validators.required],  // ho va ten
    staffCode: [null], // ma nhan vien - custom truong user
    passWord: [null, Validators.required], // Password HDFS
    login: [null, Validators.required], // username
    activated: [null]// status

    // custom control name user
  })
  authority = AuthoritiesConstant;
  authorities: any[];
  searchActive: boolean;
  showPassword = false;
  showPasswordCf = false;
  listRoleGroup = [];
  listBroweseUserHdfs = [];
  listWpGroup = [];
  groupIdDefault: any;
  selectedHdfs: any;
  user: any;
  isUserHdfs;
  users?: User[] = new Array<User>();

  listModule = [];
  listRole = [];
  listUserHdfsId = [];

  selectedRole: any;
  selectRoleDefault: any;

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

  }

  ngOnInit(): void {
    this.getUserInfo();
    this.getListWpGroup();
    this.userService.authorities().subscribe(authorities => {
      this.authorities = authorities
    });

    this.getAllRoleGroup();

    this.getBroweseUserHdfs();
    const options = {
      keyStatus: '',
      keyUserHandler: '',
      keyUserSend: '',
      typeSr: '',
      keySearch: ''
    }
    this.sendDataBreadcrumb();
    // this.getAllSupportRequestInfo(options);
    // this.addRowUser();
    // this.rowData = [{
    //   stt: '1', userName: 'aloha', Module: 'LB mangaer', rpAppName: '', result: ''
    // }];
    this.CreateDataFake(); // custom data fake
  }

  actionContentSR(key: string) {
    console.log(key)
    this.shareData.sendSR(key)
  }

  sendDataBreadcrumb() {
    const url_id = this.router.url.toString().substring(this.router.url.toString().lastIndexOf('/') + 1, this.router.url.length);
    this.shareData.updateData({
      title: 'Setting',
      groupText: 'User manager',
      titleChild: 'Chi tiết người dùng',
      urlParent: '/page/user-management/user',
      urlPage: `/page/user-management/user/${url_id}`,
    })

  }

  // addRowUser() {
  //   if (this.listUserForm.value.length <= 3) {
  //     this.listUserForm.push(this.fb.group({
  //       selectedFilter: [null, Validators.required],
  //       selectedType: ['', Validators.required],
  //     }));
  //     this.lists.push([]);
  //   }
  // }

  deleteUserSR(userId: number) {
    this.rowData = [...this.rowData].filter(v => v.id !== userId);
    const arrayId = [];
    arrayId.push(userId);
    this.listSrCenSorDelete = [...this.listSrCenSorDelete].concat(arrayId);
  }

  getAllRoleGroup(): void {
    this.roleServices.getAllRoleGroup({}).subscribe((res) => {
      this.listRoleGroup = res.body.results
    })
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
      this.formGroupInfoGroup.controls['userHdfsId'].patchValue(this.selectedHdfs);
    })
  }

  addUserSR(event) {
    const checkSameUser = this.listUserHanndlerNew.some((value, index) => {
      return event?.login === value?.login
    });
    if (checkSameUser !== true) {
      this.listUserHanndlerNew.push(event);
      if (event) {
        const arrayIdAdd = [event];
        this.rowData = [...this.rowData].concat(arrayIdAdd);
      }
    }
    this.isValidateListReview = false;
  }

  deleteRowUser(row: any, index: number) {
    this.listUserEditMapping = [...this.listUserEditMapping].filter((e, indexs) => indexs !== index);
    if (this.paramId) {
      this.listSrUserMapDelete.push(row?.id);
    }
  }


  getUser() {
    // console.log(this.router.url);
    // const index = this.router.url.lastIndexOf('/');
    // const user_id = this.router.url.substring(index + 1, this.router.url.length);
    // console.log(user_id);
    // userName: [null],  // ho va ten
    //   staffCode: [null], // ma nhan vien
    //   passWord: [null], // Password HDFSasdasdasdasd
    // this.user = this.userService.CurrentUserManagement;
    this.selectedRole = this.user?.roleGroup?.id;
    this.selectRoleDefault = this.user.roleGroup?.id;
    this.formGroupInfoGroup.get('userName').patchValue(this.user.firstName);
    this.formGroupInfoGroup.get('staffCode').patchValue(this.user.staffCode);
    this.formGroupInfoGroup.get('passWord').patchValue(this.user.passWord);
    // console.log(this.user);
    let status_user;
    if (this.user.activated === true) {
      status_user = 'active'
    } else {
      status_user = 'not active'
    }
    // console.log('password : ', this.user.password);
    this.formGroupInfoGroup.get('passWord').patchValue(this.user.password);
    this.formGroupInfoGroup.get('login').patchValue(this.user.login);
    this.formGroupInfoGroup.get('activated').patchValue(status_user);
    this.formGroupInfoGroup.get('groupId').patchValue(this.user.groupId);
    this.formGroupInfoGroup.get('typeUser').patchValue(this.user.typeUser);
    this.formGroupInfoGroup.get('phoneNumber').patchValue(this.user.phoneNumber);
    this.formGroupInfoGroup.get('email').patchValue(this.user.email);
    this.formGroupInfoGroup.get('moduleId').valueChanges.subscribe(value => {
      this.listRole = [];
      this.formGroupInfoGroup.get('userHdfsId').reset();
      // this.formGroupInfoGroup.get('listDPermission').reset();
      if (value) {
        this.accounttService.getListRole(value).subscribe(res => {
          if (res) this.listRole = res;
        });
        if (value === 2) {
          this.formGroupInfoGroup.get('userHdfsId').setValidators([Validators.required]);
          this.formGroupInfoGroup.get('userHdfsId').updateValueAndValidity();
        } else {
          this.formGroupInfoGroup.get('userHdfsId').clearValidators();
          this.formGroupInfoGroup.get('userHdfsId').updateValueAndValidity();
        }
      } else this.listRole = [];
    })
    this.formGroupInfoGroup.get('userHdfsId').valueChanges.subscribe(value => {
      // this.formGroupInfoGroup.get('listDPermission').reset();
      if (value) {
        this.accounttService.getListRoleByHDFS(value, this.user.id).subscribe(res => {
          const listRoleId = [];
          res && res.forEach(a => {
            listRoleId.push(a.id);
          })
          // this.formGroupInfoGroup.get('listDPermission').patchValue(listRoleId);
        });
      }
    })

    const pass_encode = this.b64EncodeUnicode(this.user.passWord);
    // console.log(pass_encode);
  }

  ngOnDestroy() {
    this.userService.CurrentUserManagement = {};
    console.log('closed component : ', this.userService.CurrentUserManagement);
  }

  navigateToUserList() {
    this.router.navigate(['/page/user-management/user'])
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

  getUserInfo(): void {
    const id_index = this.router.url.lastIndexOf('/') + 1;
    const id = this.router.url.substring(id_index, this.router.url.length);

    this.accounttService.getUser(id).subscribe((res: any) => {
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
            // listDPermission: [],
            codeArr: [],
            userHdfsId: res.authorities.find(authority => authority.moduleId === moduleId)['userHdfsId'],
          };
          res.authorities.forEach(authority => {
            if (authority.moduleId === moduleId) {
              // temp.listDPermission.push(authority.permissionId);
              temp.codeArr.push(authority.userHdfsName ? authority.userHdfsName + '_' + authority.code + ' ' : authority.code + ' ');
            }
          })
          result.push(temp);
          // console.log('response : ', res);
          // console.log('results : ', result);
          // console.log('temp : ', temp);
          this.user = res;
          this.getUser();

        })
        // this.rows = result;

      }

    })
  }

  // custom create data
  CreateDataFake() {
    const data = []
    for (let i = 0; i < 100; i++) {
      const data_child = {stt: '1', userName: 'aloha', Module: 'LB mangaer', rpAppName: '', result: ''}
      data.push(data_child);
    }
    this.rowData = data;
  }

  b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16))
    }))
  }

  togglePassword(inputPassword: HTMLInputElement) {
    if (inputPassword.type === 'password') {
      inputPassword.type = 'text'
    } else {
      inputPassword.type = 'passWord'
    }
  }

  save() {
    let status;
    if (this.formGroupInfoGroup.value.activated === 'active') {
      status = 1;
    } else {
      status = 0;
    }

    const option = {
      id: this.user.id,
      userId: this.user.id,
      userHdfsId: this.selectedHdfs,
      status: status,
      groupId: this.formGroupInfoGroup.value.groupId,
      phoneNumber: this.formGroupInfoGroup.value.phoneNumber,
      typeUser: this.formGroupInfoGroup.value.typeUser,
      hdfsUserId: this.user.isUserHdfs,
      firstName: this.formGroupInfoGroup.value.userName
      // permissionId : this.selectedRole
    }
    this.accounttService.updateRoleGroup({roleName: this.selectedRole, option}).subscribe((res) => {
        this.toastrService.success(this.translate.instant('success.http.editSuccess'), this.translate.instant('success.http.notify'));
        // this.selectedHdfs = []
        this.formGroupInfoGroup.reset();
        this.getUserInfo();
      },
      error => {
        this.toastrService.danger(error.error.message, this.translate.instant('success.http.notify'));
      }
    )
    // console.log(option);
    // console.log(this.selectRoleDefault);
  }
}



import {Component, OnInit, OnChanges} from '@angular/core';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {TranslateService} from '@ngx-translate/core';
import {AccessAuthorizationService} from '../../services/access-authorization.service';
import {PopupErrorComponent} from '../popup-error/popup-error.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthoritiesConstant} from '../../authorities.constant';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-access-authorization',
  templateUrl: './access-authorization.component.html',
  styleUrls: ['./access-authorization.component.scss']
})
export class AccessAuthorizationComponent implements OnInit, OnChanges {
  ruleAccess = 'GROUP';
  isLoading: boolean = false;
  selecteGroup: any;
  selecteThritf: any;
  selecteUser: any;
  dateCreate: any;
  dateEnd: any;
  rowData = [];
  rowDataCheck = [];
  wpThritf = [];
  wpGroup = [];
  user = [];
  selecteUserId: any;
  thriftIdDelete: any;
  checkDate: boolean = false;
  idGroupItem: any;
  idUserItem: any;
  userIdSelect: any;
  authority = AuthoritiesConstant;
  columnsGroup = [
    {name: 'Stt', prop: 'stt', flexGrow: 0.5},
    {name: 'HDFSBrowser.column.group', prop: 'groupName', flexGrow: 1},
    {name: 'Thrifts', prop: 'thriftName', flexGrow: 1},
    {name: 'serverIpTables.label.status', prop: 'activated', flexGrow: 0.8},
    {name: 'user.column.active', prop: 'action', flexGrow: 0.8}
  ];
  columnsUser = [
    {name: 'Stt', prop: 'stt', flexGrow: 0.5},
    {name: 'User', prop: 'userName', flexGrow: 1},
    {name: 'Thrifts', prop: 'thriftName', flexGrow: 1},
    {name: 'accessAuthorization.dateCreated', prop: 'activeAt', flexGrow: 1},
    {name: 'accessAuthorization.expiryDate', prop: 'inActiveAt', flexGrow: 1},
    {name: 'serverIpTables.label.status', prop: 'activated', flexGrow: 0.8},
    {name: 'user.column.active', prop: 'action', flexGrow: 0.8}
  ];
  listPermission = [
    {name: 'accessAuthorization.groupAccess', code: 'GROUP'},
    {name: 'accessAuthorization.userAccess', code: 'USER'}
  ]
  limits = [5, 10, 15, 20];
  limit = 10;
  checkStatus: any;
  formGroups: FormGroup = this.fb.group({
    selecteGroupId: [null],
    selecteThritfId: [null],
    selecteUserId: [null],
  })

  constructor(public dialogService: NbDialogService,
              private shareData: ShareDataBreadcrumbService,
              private toastrService: NbToastrService,
              public translate: TranslateService,
              private fb: FormBuilder,
              private accessAuthorizationServices: AccessAuthorizationService
  ) {
  }

  ngOnInit(): void {
    this.sendDataTest();
    this.searchAccessAuthorization();
    this.searchWpThrift();
    this.searchWpGroup();
    this.getUsers();
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Access manager',
      groupText: 'Thrift authorization',
      titleChild: 'Access authorization',
      urlPage: '/page/access-authorization',
    })
  }

  ngOnChanges(): void {
    console.log('a')
  }

  getUsers() {
    this.accessAuthorizationServices.getUsers({}).subscribe(res => {
      this.user = res.body.results
    })
  }

  searchAccessAuthorization() {
    this.isLoading = true
    const options = {}
    this.accessAuthorizationServices.searchAccessAuthorization({options, access: this.ruleAccess}).subscribe(res => {
      if (res.responseType === 'SUCCESS') {
        this.isLoading = false;
        this.rowData = res.results[0];
        this.rowDataCheck = res.results[0];
      } else {
        this.isLoading = false;
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    })
  }

  searchWpThrift() {
    this.accessAuthorizationServices.searchWpThrift({}).subscribe(res => {
      this.wpThritf = res.body?.results;
    })
  }

  searchWpGroup() {
    this.accessAuthorizationServices.searchWpGroup({}).subscribe(res => {
      this.wpGroup = res.body?.results;
    })
  }

  ChangeRuleAccess() {
    this.searchAccessAuthorization()
  }

  checkAdd() {
    this.selecteUser = null;
    this.selecteThritf = null;
    this.selecteGroup = null;
    this.checkDate = false;
    this.dateCreate = '';
    this.dateEnd = ''
  }

  addGroupThrift(ref) {
    const options = {
      thriftId: this.selecteThritf,
      groupId: this.selecteGroup
    }
    this.accessAuthorizationServices.addGroupThrift(options).subscribe(res => {
      if (res.responseType === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('accessAuthorization.add'), this.translate.instant('toast.note'));
        this.searchAccessAuthorization();
      } else {
        this.toastrService.danger(res?.message, this.translate.instant('toast.note'));
        this.isLoading = false
      }
    }, (error) => {
      console.log(error);
      this.toastrService.danger(this.translate.instant('accessAuthorization.error'), this.translate.instant('toast.note'));
    })
    ref.close()
  }

  groupId(item) {
    console.log(item)
    this.formGroups.get('selecteThritfId').patchValue(item.thriftId);
    this.formGroups.get('selecteGroupId').patchValue(item.groupId);
    this.formGroups.get('selecteUserId').patchValue(item.userId);
    this.idGroupItem = item?.id;
    this.checkStatus = item?.activated
  }

  updateGroupThrift(ref) {
    this.isLoading = true;
    const options = {
      thriftId: this.formGroups.value.selecteThritfId,
      groupId: this.formGroups.value.selecteGroupId,
      activated: this.checkStatus
    }
    this.accessAuthorizationServices.updateGroupThrift({options, id: this.idGroupItem}).subscribe(res => {
      if (res.responseType === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('accessAuthorization.update'), this.translate.instant('toast.note'));
        this.searchAccessAuthorization();
      } else {
        this.toastrService.danger(res?.message, this.translate.instant('toast.note'));
        this.isLoading = false
      }
    }, (error) => {
      this.toastrService.danger(this.translate.instant('accessAuthorization.error'), this.translate.instant('toast.note'));
      this.isLoading = false
    })
    ref.close()
  }

  formatDateCheck(date) {
    if (date) {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;

      return [year, month, day].join('-');
    } else {
      return ''
    }
  }

  addUserThrift(ref) {
    const today = new Date();
    if (this.dateCreate > this.dateEnd || this.formatDateCheck(this.dateCreate) < this.formatDateCheck(today)) {
      this.checkDate = true;
    } else {
      this.isLoading = true;
      this.checkDate = false;
      const options = {
        thriftId: this.selecteThritf,
        userId: this.selecteUser?.id,
        userName: this.selecteUser?.login,
        activeAt: this.dateFormat(this.dateCreate),
        inactiveAt: this.dateFormat(this.dateEnd)
      }
      this.accessAuthorizationServices.addUserThrift(options).subscribe(res => {
        if (res.responseType === 'SUCCESS') {
          this.toastrService.success(this.translate.instant('accessAuthorization.add'), this.translate.instant('toast.note'));
          this.searchAccessAuthorization();
        } else {
          if (res?.message === 'UserId and ThriftId already exist') {
            this.toastrService.danger(this.translate.instant('accessAuthorization.listError.exist'), this.translate.instant('toast.note'));
          } else if (res?.message === 'Server chưa có thông tin IP table') {
            this.toastrService.danger(this.translate.instant('accessAuthorization.listError.notInFoIpTable'), this.translate.instant('toast.note'));
          } else if (res?.message === 'Connect fail') {
            this.toastrService.danger(this.translate.instant('accessAuthorization.listError.connectFail'), this.translate.instant('toast.note'));
          } else {
            this.toastrService.danger(res?.message, this.translate.instant('toast.note'));
          }
          this.isLoading = false
        }
      }, (error) => {
        console.log(error)
        this.toastrService.danger(this.translate.instant('accessAuthorization.error'), this.translate.instant('toast.note'));
        this.isLoading = false
      })
      ref.close()
    }
  }

  dateFormat(date) {
    const dateInput = new Date(date);
    const dateStringOutPut = dateInput.getFullYear() + '-' +
      ('0' + (dateInput.getMonth() + 1)).slice(-2) + '-' +
      ('0' + dateInput.getDate()).slice(-2) + ' ' +
      ('0' + dateInput.getHours()).slice(-2) + ':' +
      ('0' + dateInput.getMinutes()).slice(-2) + ':' +
      ('0' + dateInput.getSeconds()).slice(-2)
    return dateStringOutPut
  }

  userId(item) {
    this.userIdSelect = item?.userId
    this.formGroups.get('selecteThritfId').patchValue(item?.thriftId);
    this.formGroups.get('selecteGroupId').patchValue(item?.groupId);
    this.formGroups.get('selecteUserId').patchValue(item?.userId);
    this.selecteUserId = item?.userName;
    this.idUserItem = item?.id;
    this.thriftIdDelete = item?.thriftId;
    this.checkStatus = item?.activated;
    this.dateCreate = this.dateFormat(item?.activeAt);
    this.dateEnd = this.dateFormat(item?.inActiveAt);
  }

  updateUserThrift(ref) {
    this.isLoading = true;
    const options = {
      thriftId: this.formGroups.value.selecteThritfId,
      userId: this.formGroups.value.selecteUserId,
      thiftIdOld: this.thriftIdDelete,
      activated: this.checkStatus,
      userName: this.selecteUserId,
      activeAt: this.dateFormat(this.dateCreate),
      inactiveAt: this.dateFormat(this.dateEnd)
    }
    this.accessAuthorizationServices.updateUserThrift({options, id: this.idUserItem}).subscribe(res => {
      if (res.responseType === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('accessAuthorization.update'), this.translate.instant('toast.note'));
        this.searchAccessAuthorization();
      } else {
        if (res?.message === 'UserId and ThriftId already exist') {
          this.toastrService.danger(this.translate.instant('accessAuthorization.listError.exist'), this.translate.instant('toast.note'));
        } else if (res?.message === 'Server chưa có thông tin IP table') {
          this.toastrService.danger(this.translate.instant('accessAuthorization.listError.notInFoIpTable'), this.translate.instant('toast.note'));
        } else if (res?.message === 'Connect fail') {
          this.toastrService.danger(this.translate.instant('accessAuthorization.listError.connectFail'), this.translate.instant('toast.note'));
        } else {
          this.toastrService.danger(res?.message, this.translate.instant('toast.note'));
        }
        this.isLoading = false
      }
    }, (error) => {
      this.toastrService.danger(this.translate.instant('accessAuthorization.error'), this.translate.instant('toast.note'));
      this.isLoading = false
    })
    ref.close()
  }

  deleteByIdGroupThrift(deleteRef) {
    this.isLoading = true;
    this.accessAuthorizationServices.deletebyIdGroupThrift(this.idGroupItem).subscribe(result => {
      if (result['responseType'] === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('serverIpTables.success.deleteSuccess'), this.translate.instant('toast.note'));
        this.searchAccessAuthorization()
      } else {
        this.toastrService.danger(result['message'], this.translate.instant('toast.note'));
        this.isLoading = false
      }

    }, (error) => {
      this.toastrService.danger(this.translate.instant('accessAuthorization.error'), this.translate.instant('toast.note'));
      this.isLoading = false;
    })
    deleteRef.close()
  }

  deletebyIdUserThrift(deleteRef) {
    this.isLoading = true;
    this.accessAuthorizationServices.deletebyIdUserThrift({
      id: this.idUserItem,
      thriftId: this.thriftIdDelete,
      userId: this.userIdSelect
    }).subscribe(res => {
      if (res['responseType'] === 'SUCCESS') {
        this.toastrService.success(this.translate.instant('serverIpTables.success.deleteSuccess'), this.translate.instant('toast.note'));
        this.searchAccessAuthorization();
      } else {
        this.toastrService.danger(res['message'], this.translate.instant('toast.note'));
        this.isLoading = false
      }
    }, (error) => {
      console.log(error)
      this.toastrService.danger(this.translate.instant('accessAuthorization.error'), this.translate.instant('toast.note'));
      this.isLoading = false;
    })
    deleteRef.close()
  }

  searchGroup(value: any) {
    if (value.target.value !== '') {
      this.rowData = this.rowDataCheck.filter(v => v.groupName.toLowerCase().indexOf(value.target.value.trim().toLowerCase()) !== -1)
    } else {
      this.rowData = this.rowDataCheck
    }
  }

  searchUser(value: any) {
    if (value.target.value !== '') {
      this.rowData = this.rowDataCheck.filter(v => v.userName.toLowerCase().indexOf(value.target.value.trim().toLowerCase()) !== -1)
    } else {
      this.rowData = this.rowDataCheck
    }
  }
}

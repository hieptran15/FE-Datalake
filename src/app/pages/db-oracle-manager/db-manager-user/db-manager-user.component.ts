import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
// import {RoleManagementService} from '../../services/role-management.service';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {FormBuilder, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {AuthoritiesConstant} from '../../../authorities.constant';
import {PopupErrorComponent} from '../../popup-error/popup-error.component';
import {DbOracleManagerService} from '../../../services/db-oracle-manager.service';

@Component({
  selector: 'ngx-db-manager-user',
  templateUrl: './db-manager-user.component.html',
  styleUrls: ['./db-manager-user.component.scss'],
})
export class DbManagerUserComponent implements OnInit, OnChanges {
  @Input('DBname') DBname: any;

  columns = [
    {name: 'STT', prop: 'stt', flexGrow: 0.5},
    {name: 'User Name', prop: 'userName', flexGrow: 0.7},
    {name: 'Default table space', prop: 'defaultTableSpace', flexGrow: 1},
    {name: 'Status', prop: 'accountStatus', flexGrow: 1},
    {name: 'Created time', prop: 'created', flexGrow: 0.7},
    {name: 'EXP date', prop: 'expiryDate', flexGrow: 0.7},
  ];
  checkQuota: boolean = false;
  limits = [5, 10, 15, 20];
  limit = 10;
  count = 0;
  tableSpacelist = [];

  showPassword?: boolean;
  isLoading: boolean = false
  rowData = [];
  rows = [];

  searchText = '';
  authoritiesConstant = AuthoritiesConstant
  formGroup = this.fb.group({
    id: [null],
    // hdfsUser: ['', Validators.required],
    // oracleUser : ['', Validators.required],
    userName: [null, [Validators.required]],
    passWord: [null, [Validators.required, Validators.maxLength(50)]],
    tableSpace: [null, [Validators.required]],
    Quota: [null],
  });


  constructor(
    public dialogService: NbDialogService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastrService: NbToastrService,
    private dbOracleService: DbOracleManagerService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.DBname !== null && this.DBname !== undefined) {
      this.getUserOracle(this.DBname);
    }
    this.getTableSpaceName();
    this.rowData = [...this.rows];
  }

  ngOnInit(): void {

  }

  query() {

  }

  openAddorEditDialog(ref: any, data?: any): void {
    this.checkQuota = false;
    data && this.formGroup.patchValue({
      userName: data.userName,
      passWord: data.passWord,
      tableSpace: data.tableSpace,
      Quota: data.Quota,

    });
    this.dialogService.open(ref, {context: data, closeOnBackdropClick: false}).onClose.subscribe(_ => {
      this.formGroup.reset()
    })
  }

  getTablespace(e) {

    this.formGroup.get('tableSpace').patchValue(e.target['tableSpaceitem'][0].name);

  }

  createManagerUser(ref: any) {
  }

  fillter() {

    if (this.searchText !== '') {
      this.rowData = this.rows.filter(v => v.userName.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 || v.defaultTableSpace.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1)
    } else {
      this.rowData = [...this.rows];
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  };

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  getTotalPage(rowCount, pageSize) {
    return Math.ceil(rowCount / pageSize);
  }


  getUserOracle(item) {
    this.isLoading = true;
    const options = {
      hostIp: item?.hostIp,
      port: item?.port,
      serviceName: item?.serviceName,
      userNameDatabase: item?.userName,
      passwordDatabase: item?.password
    }
    this.dbOracleService.getUserOracle(options).subscribe(res => {
      this.rows = res.body.results;
      this.rowData = [...this.rows];
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false
      });
      this.rowData = [];
    })
  }

  getTableSpaceName() {
    const options = {
      hostIp: this.DBname?.hostIp,
      port: this.DBname?.port,
      serviceName: this.DBname?.serviceName,
      userNameDatabase: this.DBname?.userName,
      passwordDatabase: this.DBname?.password
    }
    this.dbOracleService.getTableSpaceName(options).subscribe(res => {
      this.tableSpacelist = res.body.results;
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
    })
  }

  createUserDbOracle(ref) {
    const options = {
      userName: this.formGroup.value.userName,
      password: this.formGroup.value.passWord,
      tableSpaceName: this.formGroup.value.tableSpace,
      quota: this.formGroup.value.Quota,
      hostIp: this.DBname?.hostIp,
      port: this.DBname?.port,
      serviceName: this.DBname?.serviceName,
      userNameDatabase: this.DBname?.userName,
      passwordDatabase: this.DBname?.password
    }

    this.dbOracleService.createUserDbOracle(options).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        if (this.DBname !== null && this.DBname !== undefined) {
          this.getUserOracle(this.DBname);
        }
        ref.close();
        this.toastrService.success('Thêm DB thành công', 'Thông báo');
      } else {
        this.toastrService.danger(res.body.responseType, 'Thông báo');
        ref.close();
      }
    }, (error) => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false
      });
      ref.close();
    })
  }

  trackByFn(index, item) {
    return index;
  }

  changeNumber(e) {
    return !isNaN(e.key) || e.key === 'Backspace' || e.key === 'M' || e.key === 'G';
  };

  isNumeric(num) {
    return !isNaN(num)
  }

  checkValidateSize(e) {
    this.isNumeric(e.target.value)
    if (this.isNumeric(e.target.value)) {
      e.target.value >= 1000000 && e.target.value <= 32212254720 ? this.checkQuota = false : this.checkQuota = true;
    } else {
      this.checkQuota = false;
    }
  }

  hiddenErrorMessage() {
    if (this.formGroup.value.Quota === null || this.formGroup.value.Quota === '') {
      this.checkQuota = false;
    } else {
      this.isNumeric(this.formGroup.value.Quota)
      if (this.isNumeric(this.formGroup.value.Quota)) {
        this.formGroup.value.Quota >= 1000000 && this.formGroup.value.Quota <= 32212254720 ? this.checkQuota = false : this.checkQuota = true;
      } else {
        this.checkQuota = false;
      }
    }
  }
}

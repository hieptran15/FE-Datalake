import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {DbOracleManagerService} from '../../../services/db-oracle-manager.service';
import {PopupErrorComponent} from '../../popup-error/popup-error.component';
import {AuthoritiesConstant} from '../../../authorities.constant';

@Component({
  selector: 'ngx-db-info',
  templateUrl: './db-info.component.html',
  styleUrls: ['./db-info.component.scss']
})
export class DbInfoComponent implements OnInit {
  @Output() checkDropdownDB = new EventEmitter<string>();
  isLoading: boolean = false;
  rowData = [];
  rows = [];
  showPassword = false;
  valueSearch = '';
  columnsGroup = [
    {name: 'STT', prop: 'stt', flexGrow: 0.5},
    {name: 'DB name', prop: 'dbName', flexGrow: 0.9},
    {name: 'Service name', prop: 'serviceName', flexGrow: 0.9},
    {name: 'Username', prop: 'userName', flexGrow: 0.9},
    {name: 'Host', prop: 'hostIp', flexGrow: 0.9},
    {name: 'Port', prop: 'port', flexGrow: 0.9},
    {name: 'Action', prop: 'action', flexGrow: 0.8}
  ];
  listOracleScript = [{name: 'True', value: 1}, {name: 'False', value: 0}]
  limits = [5, 10, 15, 20];
  limit = 10;
  authoritiesConstant = AuthoritiesConstant
  formGroup = this.fr.group({
    dbName: [null, [Validators.required]],
    serviceName: [null, [Validators.required]],
    userName: [null, [Validators.required]],
    hostIp: [null, [Validators.required, Validators.pattern(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)]],
    port: [null, [Validators.required]],
    password: [null, [Validators.required, Validators.maxLength(50)]],
    oracleScrip: [null, [Validators.required]]
  });

  constructor(private fr: FormBuilder, public dialogService: NbDialogService, private toastrService: NbToastrService, private dbOracleService: DbOracleManagerService) {
  }

  ngOnInit(): void {
    this.getAllDbOracle();
  }

  getAllDbOracle() {
    this.isLoading = true;
    this.dbOracleService.getAllDbOracle({}).subscribe(res => {
      this.rows = res.body.results;
      this.rowData = [...this.rows];
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
    })
  }

  createDbOracle(ref) {
    this.dbOracleService.createDbOracle(this.formGroup.value).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.getAllDbOracle();
        ref.close();
        this.toastrService.success('Thêm DB thành công', 'Thông báo');
        this.checkDropdownDB.emit('DB')
      } else {
        this.toastrService.danger(res.body.message, 'Thông báo');
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

  updateDbOracle(id, ref) {
    this.dbOracleService.updateDbOracle(id, this.formGroup.value).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.getAllDbOracle();
        ref.close();
        this.toastrService.success('Cập nhật thành công', 'Thông báo');
        this.checkDropdownDB.emit('DB')
      } else {
        this.toastrService.danger(res.body.message, 'Thông báo');
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

  delete(id) {
    this.dbOracleService.deleteDbOracle(id).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.getAllDbOracle();
        this.toastrService.success('Xóa thành công', 'Thông báo');
        this.checkDropdownDB.emit('DB')
      } else {
        this.toastrService.danger(res.body.responseType, 'Thông báo');
      }
    }, (error) => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false
      });
    })
  }

  resetForm() {
    this.showPassword = false;
    this.formGroup.reset();
    this.formGroup.get('dbName').patchValue('');
    this.formGroup.get('serviceName').patchValue('');
    this.formGroup.get('userName').patchValue('');
    this.formGroup.get('hostIp').patchValue('');
    this.formGroup.get('port').patchValue('');
    this.formGroup.get('password').patchValue('');
  };

  valueEdit(value) {
    this.showPassword = false;
    this.formGroup.get('dbName').patchValue(value?.dbName);
    this.formGroup.get('serviceName').patchValue(value?.serviceName);
    this.formGroup.get('userName').patchValue(value?.userName);
    this.formGroup.get('hostIp').patchValue(value?.hostIp);
    this.formGroup.get('port').patchValue(value?.port);
    this.formGroup.get('password').patchValue(value?.password);
    this.formGroup.get('oracleScrip').patchValue(value?.oracleScrip);
  }

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  };

  changeNumber(e) {
    return !isNaN(e.key) || e.key === 'Backspace';
  };

  fillter() {
    if (this.valueSearch !== '') {
      this.rowData = this.rows.filter(v => v.dbName.toLowerCase().indexOf(this.valueSearch.toLowerCase()) !== -1 || v.serviceName.toLowerCase().indexOf(this.valueSearch.toLowerCase()) !== -1 || v.userName.toLowerCase().indexOf(this.valueSearch.toLowerCase()) !== -1 || v.hostIp.toLowerCase().indexOf(this.valueSearch.toLowerCase()) !== -1)
    } else {
      this.rowData = [...this.rows];
    }
  }
}

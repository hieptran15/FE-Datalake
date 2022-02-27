import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DbOracleManagerService} from '../../../services/db-oracle-manager.service';
import {PopupErrorComponent} from '../../popup-error/popup-error.component';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthoritiesConstant} from '../../../authorities.constant';

@Component({
  selector: 'ngx-db-manager-table-space',
  templateUrl: './db-manager-table-space.component.html',
  styleUrls: ['./db-manager-table-space.component.scss']
})
export class DbManagerTableSpaceComponent implements OnInit, OnChanges {
  @Input() dbItems;
  rowData = [];
  rows = [];
  valueSearch = '';
  checkSize: boolean = false;
  checkMaxSize: boolean = false;
  listTableSpace = [];
  isLoading: boolean = false;
  authoritiesConstant = AuthoritiesConstant
  columnsGroup = [
    {name: 'STT', prop: 'stt', flexGrow: 0.5},
    {name: 'Table space name', prop: 'tablespaceName', flexGrow: 0.7},
    {name: 'Data file path', prop: 'fileName', flexGrow: 1.2},
    {name: 'Size (MB)', prop: 'sizeMb', flexGrow: 0.6},
    {name: 'Max size (GB)', prop: 'maxSizeGb', flexGrow: 0.6},
    {name: 'User size (MB)', prop: 'userSizeMb', flexGrow: 0.6},
    {name: 'Auto EXT', prop: 'autoextensible', flexGrow: 0.6}
  ];
  limits = [5, 10, 15, 20];
  limit = 10;
  formGroup = this.fr.group({
    tablespaceName: [null, [Validators.required]],
    fileName: [null, [Validators.required]],
    sizeMb: [null, [Validators.required]],
    maxSizeGb: [null],
  });

  constructor(private dbOracleService: DbOracleManagerService, public dialogService: NbDialogService, private fr: FormBuilder, private toastrService: NbToastrService) {
  }

  ngOnInit(): void {
    // this.getTableSpaceName();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getTableSpace(this.dbItems);
    this.getTableSpaceName();
  }

  getTableSpaceName() {
    const options = {
      hostIp: this.dbItems?.hostIp,
      port: this.dbItems?.port,
      serviceName: this.dbItems?.serviceName,
      userNameDatabase: this.dbItems?.userName,
      passwordDatabase: this.dbItems?.password
    }
    this.dbOracleService.getTableSpaceName(options).subscribe(res => {
      this.listTableSpace = res.body.results;
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false
      });
      this.listTableSpace = [];
    })
  }

  getTableSpace(item) {
    this.isLoading = true;
    delete item.id;
    this.dbOracleService.getTableSpace(item).subscribe(res => {
      this.rows = res.body.results;
      this.rowData = [...this.rows];
      this.isLoading = false;
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false
      });
      this.rowData = [];
      this.isLoading = false;
    })
  }

  fillter() {
    if (this.valueSearch !== '') {
      this.rowData = this.rows.filter(v => v.tablespaceName.toLowerCase().indexOf(this.valueSearch.toLowerCase()) !== -1 || v.fileName.toLowerCase().indexOf(this.valueSearch.toLowerCase()) !== -1)
    } else {
      this.rowData = [...this.rows]
    }
  }

  resetForm() {
    this.checkSize = false;
    this.checkMaxSize = false;
    this.formGroup.reset();
    this.formGroup.get('tablespaceName').patchValue(null);
    this.formGroup.get('fileName').patchValue('');
    this.formGroup.get('sizeMb').patchValue('');
    this.formGroup.get('maxSizeGb').patchValue('');
  }

  addDataFiles(ref) {
    const options = {
      ...this.formGroup.value,
      hostIp: this.dbItems?.hostIp,
      port: this.dbItems?.port,
      serviceName: this.dbItems?.serviceName,
      userNameDatabase: this.dbItems?.userName,
      passwordDatabase: this.dbItems?.password
    }
    this.isLoading = true;
    this.dbOracleService.createDatafile(options).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.getTableSpace(this.dbItems);
        ref.close();
        this.toastrService.success('Thêm DB thành công', 'Thông báo');
      } else {
        this.toastrService.danger(res.body.message, 'Thông báo');
      }
    }, (error) => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false
      });
      this.isLoading = false;
      ref.close();
    })
  }

  addDataSpaces(ref) {
    const options = {
      ...this.formGroup.value,
      hostIp: this.dbItems?.hostIp,
      port: this.dbItems?.port,
      serviceName: this.dbItems?.serviceName,
      userNameDatabase: this.dbItems?.userName,
      passwordDatabase: this.dbItems?.password
    }
    this.isLoading = true;
    this.dbOracleService.createTableSpace(options).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.getTableSpace(this.dbItems);
        ref.close();
        this.toastrService.success('Thêm DB thành công', 'Thông báo');
      } else {
        this.toastrService.danger(res.body.message, 'Thông báo');
      }
    }, (error) => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false
      });
      this.isLoading = false;
      ref.close();
    })
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
      e.target.value >= 1000000 && e.target.value <= 32212254720 ? this.checkSize = false : this.checkSize = true;
    } else {
      this.checkSize = false
    }
  }

  checkValidateMaxSize(e) {
    this.isNumeric(e.target.value)
    if (this.isNumeric(e.target.value)) {
      e.target.value >= 1000000 && e.target.value <= 32212254720 ? this.checkMaxSize = false : this.checkMaxSize = true;
    } else {
      this.checkMaxSize = false
    }
  }

  formatNumber(value) {
    return Number(value).toFixed(2)
  }

  hiddenErrorMessage() {
    if (this.formGroup.value.maxSizeGb === '') {
      this.checkMaxSize = false;
    } else {
      if (this.isNumeric(this.formGroup.value.maxSizeGb)) {
        this.formGroup.value.maxSizeGb >= 1000000 && this.formGroup.value.maxSizeGb <= 32212254720 ? this.checkMaxSize = false : this.checkMaxSize = true;
      } else {
        this.checkMaxSize = false
      }
    }
  }

  ParseFloat(value) {
    return parseFloat(value)
  }
}

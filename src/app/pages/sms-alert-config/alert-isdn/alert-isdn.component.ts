import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SmsAlertConfigService} from '../../../@core/mock/SmsAlertConfig.service';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PopupErrorComponent} from '../../popup-error/popup-error.component';
import {AuthoritiesConstant} from '../../../authorities.constant';

@Component({
  selector: 'ngx-alert-isdn',
  templateUrl: './alert-isdn.component.html',
  styleUrls: ['./alert-isdn.component.scss']
})
export class AlertIsdnComponent implements OnInit, OnChanges {
  limit = 10;
  limits = [5, 10, 15, 20];
  columnsConfigAlert = [
    {name: 'Đầu mối', prop: 'email', flex: 1},
    {name: 'Số điện thoại', prop: 'isdn', flex: 1},
    {name: 'Nhóm cảnh báo', prop: 'typeAlert', flex: 1},
    {name: 'Ngày áp dụng', prop: 'insertDate', flex: 1},
    {name: 'Trạng thái', prop: 'status', flex: 1},
    {name: 'Hành động', prop: 'actions', flex: 1}
  ];
  keySearch = '';
  isLoading: boolean = false;
  alertArr = [];
  alertUser = [];
  alertGroup = [];
  alertIsdnForm: FormGroup = this.fb.group({
    id: [null],
    email: [null, [Validators.required]],
    isdn: [null],
    typeAlerts: [null, [Validators.required]],
    typeAlert: [null],
    status: ['1']
  });
  authoritiesConstant = AuthoritiesConstant
  @Input() rowsInput: any;
  rows;
  rowCheck = []

  constructor(private smsAlertConfigService: SmsAlertConfigService,
              public dialogService: NbDialogService,
              private toastrService: NbToastrService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.rows = this.rowsInput;
    this.fetchData();
    // this.smsAlertConfigService.loadData.subscribe(_ => {
    //   this.searchWpAlertIsdn();
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.fetchData()
  }

  fetchData(): void {
    console.log('fetch');
    // this.alertIsdnForm.get('status').patchValue('1');
    this.searchWpAlertIsdn();
    this.searchWpAlertUserOn();
    this.searchAlertGroupOn();
  }

  changAlerts(e) {
    this.alertArr = [];
    const alertObj = {groupCode: ''};
    e.forEach(i => {
      alertObj.groupCode = i;
      this.alertArr.push({...alertObj})
    })
    this.alertIsdnForm.get('typeAlert').patchValue(this.alertArr)
  }

  changAlert(e) {
    this.alertIsdnForm.get('typeAlert').patchValue(e)
  }

  changEmail(e) {
    const isdn = this.alertUser.find(i => i.userName === e)
    this.alertIsdnForm.get('isdn').patchValue(isdn.isdn)
  }

  searchWpAlertIsdn() {
    // this.isLoading = true;
    this.smsAlertConfigService.searchWpAlertIsdn(this.keySearch).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.isLoading = false;
          this.rows = [...res.body.results];
          this.rowCheck = [...res.body.results]
        } else {
          this.isLoading = false;
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.body.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
        }
      }, error => {
        this.isLoading = false;
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error.error.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      });
  }

  searchTextWpAlertIsdn() {
    if (this.keySearch !== '') {
      this.rows = this.rowCheck.filter(v => v.email.toLowerCase().indexOf(this.keySearch.toLowerCase()) !== -1 || v.typeAlert.toLowerCase().indexOf(this.keySearch.toLowerCase()) !== -1)
    } else {
      this.rows = this.rowCheck
    }
  }

  searchWpAlertUserOn() {
    this.isLoading = true;
    this.smsAlertConfigService.searchStatusOnAlertUserOn().subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.alertUser = res.body.results;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.body.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
        }
      }, error => {
        this.isLoading = false;
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error.error.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      });
  }

  searchAlertGroupOn() {
    this.smsAlertConfigService.searchStatusOnAlerGroup().subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.alertGroup = res.body.results;
        } else {
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.body.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
        }
      }, error => {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error.error.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    )
  }

  setValuealertIsdnForm(index) {
    console.log(this.rows[index])
    this.alertIsdnForm.patchValue({
        id: this.rows[index].id,
        email: this.rows[index].email,
        isdn: this.rows[index].isdn,
        typeAlert: this.rows[index].typeAlert,
        typeAlerts: this.rows[index].typeAlert,
        status: this.rows[index].status
      }
    )
  }

  saveAlertIsdn(ref?, ref2?) {
    this.isLoading = true;
    this.smsAlertConfigService.updateWpAlertIsdn(this.alertIsdnForm.value).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.searchWpAlertIsdn();
          this.toastrService.success('Action successfully', 'Notify')
          this.isLoading = false;
          this.alertIsdnForm.reset();
          ref.close();
        } else {
          this.isLoading = false;
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.body.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
        }
      }, error => {
        this.isLoading = false;
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error.error.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    )
  }

  deleteAlertIsdn(id, ref) {
    this.smsAlertConfigService.deleteWpAlertIsdn(id).subscribe(
      res => {
        if (res.responseType === 'SUCCESS') {
          this.toastrService.success('Action successfully', 'Notify')
          this.isLoading = false;
          this.searchWpAlertIsdn();
          ref.close();
        } else {
          this.isLoading = false;
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
        }
      }, error => {
        this.isLoading = false;
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error.error.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    )
  }

  isNumber(e) {
    return !isNaN(e.key) || e.key === 'Backspace';
  }

  log() {
    console.log(this.alertIsdnForm.value)
  }

  preventDefault(event) {
    event.preventDefault()
  }
}

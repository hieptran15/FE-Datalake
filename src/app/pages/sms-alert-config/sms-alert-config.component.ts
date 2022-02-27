import {Component, OnInit} from '@angular/core';
import {SmsAlertConfigService} from '../../@core/mock/SmsAlertConfig.service';
import {SmsAlertConfigModel} from '../../@core/model/smsAlertConfig.model';
import {PopupErrorComponent} from '../popup-error/popup-error.component';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthoritiesConstant} from '../../authorities.constant';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-sms-alert-config',
  templateUrl: './sms-alert-config.component.html',
  styleUrls: ['./sms-alert-config.component.scss']
})
export class SmsAlertConfigComponent implements OnInit {
  isLoading: boolean = false;
  smsAlertConfig: SmsAlertConfigModel = {};
  smsAlertConfigKey = '';
  limit = 10;
  limits = [5, 10, 15, 20];
  columns = [
    {name: 'Đầu mối', prop: 'userName', flex: 1},
    {name: 'Số điện thoại', prop: 'isdn', flex: 1},
    {name: 'Trạng thái', prop: 'status', flex: 1},
    {name: 'Ngày tạo', prop: 'insertDate', flex: 1},
    {name: 'Hành động', prop: 'actions', flex: 1}];
  rows = [];
  alertUserForm: FormGroup;
  rowCheck = []
  rowIsdn = [];
  authoritiesConstant = AuthoritiesConstant

  constructor(private smsAlertConfigService: SmsAlertConfigService,
              public dialogService: NbDialogService,
              private shareData: ShareDataBreadcrumbService,
              private toastrService: NbToastrService,
              private fb: FormBuilder
  ) {
    this.alertUserForm = this.fb.group({
        id: [null],
        userName: [null, [Validators.required]],
        isdn: [null, [Validators.required]],
        status: ['1'],
      },
    )
  }

  ngOnInit(): void {
    this.sendDataTest();
    this.searchWpAlertUser();
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'DATALAKE MANAGEMENT',
      titleChild: 'SMS alert config',
      urlPage: '/webportal/sms-alert-config',
    })
  }

  searchWpAlertUser() {
    this.isLoading = true;
    this.smsAlertConfigService.searchWpAlertUser(this.smsAlertConfigKey).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.isLoading = false;
          this.rows = res.body.results;
          this.rowCheck = res.body.results;
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

  searchTextWpAlertUser() {
    if (this.smsAlertConfigKey !== '') {
      this.rows = this.rowCheck.filter(v => v.userName.toLowerCase().indexOf(this.smsAlertConfigKey.toLowerCase()) !== -1)
    } else {
      this.rows = this.rowCheck
    }
  }

  deleteWpAlertUser(id: number, ref: any) {
    this.isLoading = true;
    this.smsAlertConfig = {};
    this.smsAlertConfigService.deleteWpAlertUser(id).subscribe(
      res => {
        if (res.responseType === 'SUCCESS') {
          this.isLoading = false;
          this.toastrService.success('Action successfully', 'Notify')
          this.searchWpAlertUser();
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
      });
  }

  setValueAlertUserForm(index) {
    if (this.rows[index].status === 1) {
      this.alertUserForm.patchValue({
        id: this.rows[index].id,
        userName: this.rows[index].userName,
        isdn: this.rows[index].isdn,
        status: 0
      });
    } else {
      this.alertUserForm.patchValue({
        id: this.rows[index].id,
        userName: this.rows[index].userName,
        isdn: this.rows[index].isdn,
        status: 1
      });
    }
    console.log('change');
  }

  updateWpAlertUser(ref?) {
    this.isLoading = true;
    this.smsAlertConfigService.updateWpAlertUser(this.alertUserForm.value).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.isLoading = false;
          this.alertUserForm.reset();
          this.toastrService.success('Action successfully', 'Notify')
          this.searchWpAlertUser();
          // this.searchWpAlertIsdn();
          this.smsAlertConfigService.loadData.next('success');

          ref?.close();
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

  isNumber(e) {
    return !isNaN(e.key) || e.key === 'Backspace';
  }

  searchWpAlertIsdn() {
    // this.isLoading = true;
    this.smsAlertConfigService.searchWpAlertIsdn('').subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.isLoading = false;
          this.rowIsdn = res.body.results;
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

  showConfirmDialog(rowIndex, ref, event): void {
    event.preventDefault();
    event.stopPropagation();
    this.dialogService.open(ref, {context: rowIndex, closeOnBackdropClick: false});
  }
}

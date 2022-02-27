import {Component, OnInit} from '@angular/core';
import {SmsAlertConfigService} from '../../../@core/mock/SmsAlertConfig.service';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PopupErrorComponent} from '../../popup-error/popup-error.component';
import {AuthoritiesConstant} from '../../../authorities.constant';

@Component({
  selector: 'ngx-alert-group',
  templateUrl: './alert-group.component.html',
  styleUrls: ['./alert-group.component.scss']
})
export class AlertGroupComponent implements OnInit {
  limit = 10;
  limits = [5, 10, 15, 20];
  columnsGroupAlert = [
    {name: 'Nhóm cảnh báo', prop: 'groupCode', flex: 1},
    {name: 'Mô tả', prop: 'description', flex: 1},
    {name: 'Trạng Thái', prop: 'status', flex: 1},
    {name: 'Ngày tạo', prop: 'insertDate', flex: 1},
    {name: 'Hành động', prop: 'actions', flex: 1}];
  rows = [];
  rowCheck = []
  rowIsdn = [];
  keySearch = '';
  alertGroupForm: FormGroup;
  authoritiesConstant = AuthoritiesConstant

  constructor(private smsAlertConfigService: SmsAlertConfigService,
              public dialogService: NbDialogService,
              private toastrService: NbToastrService,
              private fb: FormBuilder) {
    this.alertGroupForm = this.fb.group({
      id: [null],
      groupCode: [null, Validators.required],
      description: [null],
      status: ['1']
    })
  }

  ngOnInit(): void {
    this.searchAlertGroup();
  }

  searchAlertGroup() {
    this.smsAlertConfigService.searchWpAlertGroup(this.keySearch).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.rows = res.body.results;
          this.rowCheck = res.body.results;
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

  searchTextAlertGroup() {
    if (this.keySearch !== '') {
      this.rows = this.rowCheck.filter(v => v.groupCode.toLowerCase().indexOf(this.keySearch.toLowerCase()) !== -1)
    } else {
      this.rows = this.rowCheck
    }
  }

  saveAlertGroup(ref?) {
    this.smsAlertConfigService.updateWpAlertGroup(this.alertGroupForm.value).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.toastrService.success('Action successfully', 'Notify')
          this.searchAlertGroup();
          this.smsAlertConfigService.loadData.next();
          ref.close();
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

  deleteAlertGroup(id, ref) {
    this.smsAlertConfigService.deleteWpAlertGroup(id).subscribe(
      res => {
        if (res.responseType === 'SUCCESS') {
          this.toastrService.success('Action successfully', 'Notify')
          this.searchAlertGroup();
          // this.smsAlertConfigService.loadData.next('');
          ref.close();
        } else {
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.message},
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

  setValuealertGroupForm(index) {
    if (this.rows[index].status === 1) {
      this.alertGroupForm.patchValue({
          id: this.rows[index].id,
          groupCode: this.rows[index].groupCode,
          description: this.rows[index].description,
          status: 0
        }
      )
    } else {
      this.alertGroupForm.patchValue({
          id: this.rows[index].id,
          groupCode: this.rows[index].groupCode,
          description: this.rows[index].description,
          status: 1
        }
      )
    }
  }

  showConfirmDialog(rowIndex, ref, event): void {
    event.preventDefault();
    event.stopPropagation();
    this.dialogService.open(ref, {context: rowIndex});
  }
}

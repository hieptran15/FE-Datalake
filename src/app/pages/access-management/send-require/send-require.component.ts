import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Page} from '../../../@core/model/page.model';
import {AccessManagementService} from '../../../@core/mock/access-management.service';
import {Router} from '@angular/router';
import {Job} from '../../../@core/model/job.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NbToastrService} from '@nebular/theme';
import {HttpResponse} from '@angular/common/http';

@Component({
  selector: 'ngx-send-require',
  templateUrl: './send-require.component.html',
  styleUrls: ['./send-require.component.scss']
})
export class SendRequireComponent implements OnInit {

  @Input() currentTheme;
  @Input() loading;

  @Output() loadingChange = new EventEmitter();
  @Output() reloadAuthen = new EventEmitter();

  columns = [
    {name: 'STT', prop: 'index', flexGrow: 0.5},
    {name: 'Mail', prop: 'userName', flexGrow: 1},
    {name: 'Team', prop: 'team', flexGrow: 1},
    {name: 'Người yêu cầu', prop: 'userCreateName', flexGrow: 1},
    {name: 'Ứng dụng cha', prop: 'rpAppName', flexGrow: 1},
    {name: 'Ứng dụng', prop: 'appName', flexGrow: 1},
    {name: 'Ip', prop: 'appIp', flexGrow: 1},
    {name: 'Port', prop: 'port', flexGrow: 1},
    {name: 'Bắt đầu', prop: 'startTime', flexGrow: 1},
    {name: 'Kết thúc', prop: 'endTime', flexGrow: 1},
  ];
  file;
  formGroup: FormGroup = this.fb.group({
    user: [null, [Validators.required]],
    app: [null, [Validators.required]],
    startTime: [null, [Validators.required]],
    endTime: [null, [Validators.required]],
    cronTab: [null],
    reason: [null, [Validators.required]],
    attach: [null],
  });
  listAppParent;
  mask = {
    guide: true,
    showMask: false,
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
  };
  newJob = new Job();
  page = new Page();
  rows: any = [];
  users: any;
  window;
  userName = '';

  constructor(
    private accessManagementService: AccessManagementService,
    private fb: FormBuilder,
    private toastrService: NbToastrService,
  ) {
  }

  ngOnInit(): void {
    // this.window = this.router.url;
    // this.window = document.location.hostname;\
    this.accessManagementService.getUser().subscribe(res => {
      if (res.body.results && res.body.results.length) {
        this.window = res.body.results[0].account;
      }
    });
    this.accessManagementService.getListUser().subscribe(res => {
      if (res) {
        this.users = res.results;
        if (this.users && this.users.length > 0) {
          // this.formGroup.get('user').patchValue([this.users[0].id]);
        }
      }
    });
    // const dateFormat = require('dateformat');
    const startTime = new Date();
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 8);
    console.log('startTime', startTime, endTime);
    this.formGroup.get('startTime').patchValue(startTime);
    this.formGroup.get('endTime').patchValue(endTime);
    this.formGroup.get('user').valueChanges.subscribe((value) => {
      if (value.length) {
        this.loading = true;
        this.getListSendRequire(value, this.formGroup.value.app, this.formGroup.value.startTime, this.formGroup.value.endTime);
      } else {
        this.rows = [];
      }
    });
    this.formGroup.get('app').valueChanges.subscribe(value => {
      if (value.length) {
        this.loading = true;
        this.getListSendRequire(this.formGroup.value.user, value, this.formGroup.value.startTime, this.formGroup.value.endTime);
      } else {
        this.rows = [];
      }
    });
    this.formGroup.get('startTime').valueChanges.subscribe(value => {
      if (value) {
        this.getListSendRequire(this.formGroup.value.user, this.formGroup.value.app, value, this.formGroup.value.endTime);
      }
    });
    this.formGroup.get('endTime').valueChanges.subscribe(value => {
      if (value) {
        this.getListSendRequire(this.formGroup.value.user, this.formGroup.value.app, this.formGroup.value.startTime, value);
      }
    });
  }

  getListSendRequire(user, app, startTime, endTime) {
    if (user && app) {
      const obj = {
        acIdList: user,
        appIdList: app,
        startTime: startTime,
        endTime: endTime,
      };
      this.accessManagementService.prepareAddAuthConnection(obj).subscribe((res: HttpResponse<any>) => {
        if (res) {
          this.loading = false;
          this.rows = res.body.results ? res.body.results : [];
          this.reloadAuthen.emit();
        }
      }, error => {
        this.loading = false;
      });
    }
  }

  setListAppParent(listApp) {
    if (listApp && listApp.length > 0) {
      this.listAppParent = listApp.filter(item => !item.rpAppId);
      // this.formGroup.get('app').patchValue([this.listAppParent[0].appId]);
    }
  }

  handleChangeEndTime(event) {
    return event.target.value;
  }

  onFileChange(event: Event) {
    this.file = event.target['files'][0];
    this.newJob.fileURL = this.file.name;
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.newJob.base64File = reader.result.toString();
    };
  }

  sendRequire() {
    // console.log('this form', this.formGroup, this.formGroup.get('user').invalid, this.formGroup.get('app').invalid, this.formGroup.get('startTime').invalid, this.formGroup.get('endTime'), this.formGroup.get('reason').invalid);
    if (this.formGroup.value.endTime < this.formGroup.value.startTime) {
      this.toastrService.danger('Ngày bắt đầu không được lơn hơn ngày kết thúc', 'Thông báo');
      return;
    }
    this.rows = [];
    this.loading = true;
    const obj = {
      userId: this.formGroup.value.user,
      appId: this.formGroup.value.app,
      startTime: this.formGroup.value.startTime,
      endTime: this.formGroup.value.endTime,
      reason: this.formGroup.value.reason,
      cronTab: this.formGroup.value.cronTab,
    }
    console.log('Object', obj);
    this.accessManagementService.addAuthConnection(this.file, obj).subscribe((res: HttpResponse<any>) => {
      if (res) {
        if (res.body.responseType === 'FAIL') {
          this.loading = false;
          this.toastrService.danger('Có lỗi xảy ra', 'Thông báo');
        } else {
          this.loading = false;
          this.toastrService.success('Gửi yêu cầu thành công', 'Thông báo');
          // this.rows = res.body.results;
          this.reloadAuthen.emit();
          this.formGroup.get('user').patchValue(null, {emitEvent: false});
          this.formGroup.get('app').patchValue(null, {emitEvent: false});
          this.formGroup.get('cronTab').patchValue(null, {emitEvent: false});
          this.formGroup.get('reason').patchValue(null, {emitEvent: false});
        }
      }
    }, error => {
      this.loading = false;
      this.toastrService.danger('Có lỗi xảy ra', 'Thông báo');
      this.formGroup.get('user').patchValue(null, {emitEvent: false});
      this.formGroup.get('app').patchValue(null, {emitEvent: false});
    });
  }
}

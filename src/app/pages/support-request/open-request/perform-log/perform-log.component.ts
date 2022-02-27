import {Component, OnInit} from '@angular/core';
import {SupportRequestService} from '../../../../services/support-request.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NbDialogService} from '@nebular/theme';
import {finished} from 'stream';
import {PopupErrorComponent} from '../../../popup-error/popup-error.component';
import {AccountService} from '../../../../@core/auth/account.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'ngx-perform-log',
  templateUrl: './perform-log.component.html',
  styleUrls: ['./perform-log.component.scss']
})
export class PerformLogComponent implements OnInit {
  isLoading: boolean = false;
  limits = [5, 10, 15, 20];
  limit = 10;
  columnsTable = [
    {name: 'Index', prop: 'id', flexGrow: 0.5},
    {name: 'User', prop: 'userName', flexGrow: 0.9},
    {name: 'Thời gian thực hiện', prop: 'createAt', flexGrow: 0.9},
    {name: 'Tác động ', prop: 'content', flexGrow: 0.9},
    // {name: 'File', prop: 'thriftName', flexGrow: 0.9},
    // {name: 'Người xử lý', prop: 'fileName', flexGrow: 0.9},
    {name: 'File', prop: 'fileUrl', flexGrow: 0.9},
    {name: 'Trạng thái', prop: 'status', flexGrow: 0.6},
    {name: 'Action', prop: 'action', flexGrow: 0.8}
  ];
  rowData: any;
  CacheData: any;
  // rowData = [
  //   {
  //     id: 1,
  //     userName: 'hiep',
  //     ipAddress: '120.23.12.12',
  //     rpAppName: 'Khởi tạo phiếu yêu cầu',
  //
  //     fileName: null,
  //     status: 0
  //   },
  //   {
  //     id: 1,
  //     userName: 'hiep',
  //     ipAddress: '120.23.12.12',
  //     rpAppName: 'Khởi tạo phiếu yêu cầu',
  //
  //     fileName: 'hieptran',
  //     status: 1
  //   },
  //   {
  //     id: 1,
  //     userName: 'hiep',
  //     ipAddress: '120.23.12.12',
  //     rpAppName: 'Khởi tạo phiếu yêu cầu',
  //
  //     fileName: 'hieptran',
  //     status: 1
  //   },
  //   {
  //     id: 1,
  //     userName: 'hiep',
  //     ipAddress: '120.23.12.12',
  //     rpAppName: 'Khởi tạo phiếu yêu cầu',
  //
  //     fileName: null,
  //     status: 0
  //   },
  //   {
  //     id: 1,
  //     userName: 'hiep',
  //     ipAddress: '120.23.12.12',
  //     rpAppName: 'Khởi tạo phiếu yêu cầu',
  //
  //     fileName: 'hieptran',
  //     status: 1
  //   },
  //   {
  //     id: 1,
  //     userName: 'hiep',
  //     ipAddress: '120.23.12.12',
  //     rpAppName: 'Khởi tạo phiếu yêu cầu',
  //
  //     fileName: null,
  //     status: 0
  //   },
  //   {
  //     id: 1,
  //     userName: 'hiep',
  //     ipAddress: '120.23.12.12',
  //     rpAppName: 'Khởi tạo phiếu yêu cầu',
  //
  //     fileName: 'hieptran',
  //     status: 1
  //   },
  //   {
  //     id: 1,
  //     userName: 'hiep',
  //     ipAddress: '120.23.12.12',
  //     rpAppName: 'Khởi tạo phiếu yêu cầu',
  //
  //     fileName: 'hieptran',
  //     status: 0
  //   },
  //   {
  //     id: 1,
  //     userName: 'hiep',
  //     ipAddress: '120.23.12.12',
  //     rpAppName: 'Khởi tạo phiếu yêu cầu',
  //
  //     fileName: 'hieptran',
  //     status: 0
  //   },
  //   {
  //     id: 1,
  //     userName: 'hiep',
  //     ipAddress: '120.23.12.12',
  //     rpAppName: 'Khởi tạo phiếu yêu cầu',
  //
  //     fileName: 'hieptran',
  //     status: 1
  //   },
  //   {
  //     id: 1,
  //     userName: 'hiep',
  //     ipAddress: '120.23.12.12',
  //     rpAppName: 'Khởi tạo phiếu yêu cầu',
  //
  //     fileName: 'hieptran',
  //     status: 0
  //   }
  // ];
  formPerformLog?: FormGroup;
  isFileUrl = false;
  UserLogin?: string;

  constructor(public supportRequestService: SupportRequestService,
              public fb: FormBuilder,
              public dialogService: NbDialogService,
              public accountService: AccountService
  ) {
  }

  ngOnInit(): void {
    this.formPerformLog = this.fb.group({
      User: [null],
      Action: [null],
      Status: [null],
      Date: [null],
      File: [null],
    })
    this.getUserLogin();
    this.getPerFormLog()
  }

  getUserLogin() {
    this.accountService.identity().subscribe(res => {
      const userName = res['login'];
      // this.formGroupInfoGroup.get('userHandler').patchValue(userName);
      this.UserLogin = userName;
    }, (error => {
      console.log('error', error)
    }));
  }

  getPerFormLog(): void {
    this.isLoading = true;
    this.supportRequestService.GetPerformLog(this.UserLogin).subscribe(res => {
      this.isLoading = false;
      this.rowData = res
      if (res.body.responseType === 'SUCCESS') {
        console.log(res);
        this.rowData = res.body.results;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    }, error => {
      this.isLoading = false;
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
    });

  }

  downloadFile(row: any) {
    // console.log('test download ! '); // that link download as public link with firebase
    // window.open('https://firebasestorage.googleapis.com/v0/b/angularchat-abdcd.appspot.com/o/test_file_storage%2FTi%C3%AAu%20ch%C3%AD%20ch%E1%BA%A5m%20%C4%91i%E1%BB%83m_minimize.xlsx?alt=media&token=535c9ec7-616a-4447-9d2e-a042bdff96ba');
    // console.log('filename : ',row)

    const fileName = row.fileUrl;
    this.supportRequestService.downloadFile(fileName).subscribe(res => {
      console.log(res);
      const blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
      fileSaver.saveAs(blob, row.fileUrl);
    }, error => {
      console.log(error);
    });
  }

  openDetailForm(ref: any, data: any) {
    this.formPerformLog.reset();
    this.isFileUrl = false;
    console.log('data:', data);
    if (data.fileUrl !== null && data.fileUrl !== undefined && data.fileUrl !== '') {
      this.isFileUrl = true;
    }

    let status_string = '';
    if (data.status === 1) {
      status_string = 'finished'
    } else {
      status_string = 'error';
    }
    this.formPerformLog.setValue({
      User: data.userName,
      Action: data.content,
      Status: status_string,
      Date: this.dateFormat(data.createAt),
      File: '',
    })
    this.dialogService.open(ref, {
      context: {data: data},
      closeOnBackdropClick: false,
    })
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

  Confirm() {

  }
}

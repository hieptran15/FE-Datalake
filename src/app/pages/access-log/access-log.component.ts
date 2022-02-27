import {Component, OnInit} from '@angular/core';
import {AccessLogService} from '../../services/access-log.service';
import {PopupErrorComponent} from '../popup-error/popup-error.component';
import {NbDialogService} from '@nebular/theme';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-access-log',
  templateUrl: './access-log.component.html',
  styleUrls: ['./access-log.component.scss']
})
export class AccessLogComponent implements OnInit {
  isLoading: boolean = false;
  dateCreate: any;
  dateEnd: any;
  limits = [5, 10, 15, 20];
  rowData = [];
  rowDataCheck = [];
  limit = 10;
  columns = [
    {name: 'Stt', prop: 'stt', flexGrow: 0.5},
    {name: 'User', prop: 'userName', flexGrow: 0.7},
    {name: 'Thrifts', prop: 'thriftName', flexGrow: 0.7},
    {name: 'accessLog.query', prop: 'statement', flexGrow: 1},
    {name: 'serverIpTables.label.status', prop: 'state', flexGrow: 0.8},
    {name: 'accessLog.dateCreated', prop: 'createdAt', flexGrow: 0.8},
    {name: 'accessLog.deadline', prop: 'endAt', flexGrow: 0.8},
  ];

  constructor(private accessLogServices: AccessLogService, public dialogService: NbDialogService, private shareData: ShareDataBreadcrumbService) {
  }

  ngOnInit(): void {
    this.searchLogThrift();
    this.sendDataTest();
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Access manager',
      groupText: 'Thrift authorization',
      titleChild: 'Logger',
      urlPage: '/page/access-log',
    })
  }

  searchLogThrift() {
    this.isLoading = true
    const option = {
      thriftId: '33',
      userId: '22',
      createdAt: this.formatDate(this.dateCreate),
      endAt: this.formatDate(this.dateEnd)
    }
    this.accessLogServices.searchLogThrift(option).subscribe(res => {
      if (res.responseType === 'SUCCESS') {
        this.isLoading = false;
        this.rowData = res.results[0]
        this.rowDataCheck = res.results[0]
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

  searchUser(event) {
    if (event.target.value !== '') {
      this.rowData = this.rowDataCheck.filter(v => v?.userName.toLowerCase().indexOf(event.target.value.trim().toLowerCase()) !== -1 || v?.thriftName.toLowerCase().indexOf(event.target.value.trim().toLowerCase()) !== -1)
    } else {
      this.rowData = this.rowDataCheck;
    }
  }

  formatDate(date) {
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

  filterWithDate() {
    this.searchLogThrift()
  }
}

import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {AddThreadComponent} from './add-thread/add-thread.component';
import {Router} from '@angular/router';
import {DataIngestionService} from '../../../services/data-ingestion.service';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {NewConnectionComponent} from '../connection-management/new-connection/new-connection.component';
import {LanguageService} from '../../../@core/mock/language.service';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {AuthoritiesConstant} from '../../../authorities.constant';
import {AccountService} from '../../../@core/auth/account.service';
import {ShareDataBreadcrumbService} from '../../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-monitor-ingestion',
  templateUrl: './monitor-ingestion.component.html',
  styleUrls: ['./monitor-ingestion.component.scss']
})
export class MonitorIngestionComponent implements OnInit {

  @ViewChild(DatatableComponent, {static: false}) tableFlow: DatatableComponent;
  selectProvisioning = 'Ingestion';
  valueIngestion: any;
  listProvisioning = ['Ingestion ', 'Provisioning'];
  columns = [
    {name: 'data-ingestion.column.threadCode', prop: 'id', flexGrow: 0.5},
    {name: 'data-ingestion.column.threadName', prop: 'flowName', flexGrow: 1},
    {name: 'data-ingestion.column.source', prop: 'sourceConnectionType', flexGrow: 0.7},
    {name: 'data-ingestion.column.destination', prop: 'sinkConnectionType', flexGrow: 0.7},
    {name: 'data-ingestion.column.status', prop: 'state', flexGrow: 0.7},
    {name: 'data-ingestion.column.calendar', prop: 'scheduleStrategy', flexGrow: 1},
    {name: 'data-ingestion.column.group', prop: 'groupName', flexGrow: 0.8},
    {name: 'data-ingestion.column.custom', prop: 'action', flexGrow: 0.6}
  ]
  formGroup;
  isLoading: boolean;
  listCalendar = [{name: 'Timer Driven', value: 'TIMER_DRIVEN'}, {
    name: 'CRON Driven',
    value: 'CRON_DRIVEN'
  }];
  listDestination = [{name: 'Đích', value: ''}, {name: 'HDFS', value: 'HDFS'}, {name: 'Kafka', value: 'Kafka'}];
  listGroup = [];
  listSource = [{
    name: 'FTP',
    value: 'FTP'
  }, {name: 'RDBMS', value: 'RDBMS'}];
  listCount = [{value: 5}, {value: 10}]
  listStatus = [{
    name: 'RUNNING',
    value: 'RUNNING'
  }, {
    name: 'STOPPED',
    value: 'STOPPED'
  }, {name: 'DISABLED', value: 'DISABLED'}, {name: 'ENABLED', value: 'ENABLED'}]
  nameGroup;
  rows = [];
  limits = [5, 10, 15, 20];
  limit = 10;
  authority = AuthoritiesConstant;

  constructor(
    private fb: FormBuilder,
    public dialogService: NbDialogService,
    private route: Router,
    private dataIngestionService: DataIngestionService,
    private toastrService: NbToastrService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private accountService: AccountService,
    private shareData: ShareDataBreadcrumbService
  ) {
    this.formGroup = this.fb.group({
      flowName: [null],
      calendar: [null],
      destination: [null],
      group: [null],
      source: [null],
      status: [null]
    })
  }

  ngOnInit(): void {
    this.sendDataTest();
    this.generateParam();
    this.createAllGroup();
    this.doSearchFlow();
    this.langGet();
    this.getAcount();
    // this.formGroup.get('calendar').valueChanges.subscribe(() => {
    //   this.doSearchFlow();
    // });
    // this.formGroup.get('destination').valueChanges.subscribe(() => {
    //   this.doSearchFlow();
    // });
    // this.formGroup.get('group').valueChanges.subscribe(() => {
    //   this.doSearchFlow();
    // });
    // this.formGroup.get('source').valueChanges.subscribe(() => {
    //   this.doSearchFlow();
    // });
    // this.formGroup.get('status').valueChanges.subscribe(() => {
    //   this.doSearchFlow();
    // });
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Utility',
      groupText: 'Ingestion & Provisioning',
      titleChild: 'Flow manager',
      urlPage: '/page/data-ingestion/monitor-ingestion',
    })
  }

  getAcount(): void {
    this.accountService.identity().subscribe(res => {
    });
  }

  langGet() {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.listCalendar = [{name: 'Timer Driven', value: 'TIMER_DRIVEN'}, {
        name: 'CRON Driven',
        value: 'CRON_DRIVEN'
      }];
      this.listGroup = [];
      this.listSource = [{
        name: 'FTP',
        value: 'FTP'
      }, {name: 'RDBMS', value: 'RDBMS'}];
      this.listStatus = [{name: 'RUNNING', value: 'RUNNING'}, {
        name: 'STOPPED',
        value: 'STOPPED'
      }, {name: 'DISABLED', value: 'DISABLED'}, {name: 'ENABLED', value: 'ENABLED'}]
    })
  }

  generateParam() {
    this.formGroup.get('flowName').patchValue();
    this.formGroup.get('calendar').patchValue();
    this.formGroup.get('destination').patchValue();
    this.formGroup.get('group').patchValue();
    this.formGroup.get('source').patchValue();
    this.formGroup.get('status').patchValue();
  }

  createThread() {
    this.dialogService.open(AddThreadComponent, {
      context: {
        selectProvisioning: this.selectProvisioning
      },
      closeOnBackdropClick: false,
      closeOnEsc: false,
    }).onClose.subscribe(value => {
      if (value) {
        this.generateParam();
        this.doSearchFlow();
      }
    });
  }

  detailThread(row) {
    this.route.navigate([`/page/data-ingestion/monitor-ingestion/edit/${row.id}`]);
  }

  checkActiveRoute(params) {
    const pathname = window.location.pathname;
    return pathname.includes(params);
  }

  addGroup(ref) {
    this.dataIngestionService.createGroup({groupName: this.nameGroup}).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success(this.translateService.instant('toast.addGroupSuccess'), this.translateService.instant('toast.note'));
        ref.close();
        this.createAllGroup();
      } else {
        this.toastrService.danger(this.translateService.instant('toast.addGroupError'), this.translateService.instant('toast.note'));
      }
    });
  }

  createAllGroup() {
    this.dataIngestionService.getAllListGroup().subscribe(res => {
      if (res.body.results && res.body.results.length) {
        this.listGroup = [...res.body.results];
      }
    });
  }

  doSearchFlow() {
    if (this.selectProvisioning !== 'Provisioning') {
      this.valueIngestion = 1
    } else {
      this.valueIngestion = 0
    }
    const req = {
      flowName: this.formGroup.value.flowName,
      groupId: this.formGroup.value.group,
      state: this.formGroup.value.status,
      sourceConnectionType: this.formGroup.value.source,
      sinkConnectionType: this.formGroup.value.destination,
      scheduleStrategy: this.formGroup.value.calendar,
      isIngestion: this.valueIngestion
    }
    this.isLoading = true;
    this.dataIngestionService.doSearchFlows(req).subscribe(res => {
      if (res.body.results && res.body.results.length) {
        this.rows = res.body.results.map(e => {
          const obj = e.flowsEntity;
          obj.groupName = e.processGroupEntity ? e.processGroupEntity.groupName : '';
          return obj;
        });
        this.tableFlow.offset = 0;
      } else {
        this.rows = [];
      }
      this.isLoading = false;
    });
  }

  changSource(key: any) {
    this.selectProvisioning = key;
    if (key !== 'Provisioning') {
      this.listSource = [{
        name: 'FTP',
        value: 'FTP'
      }, {name: 'RDBMS', value: 'RDBMS'}];
    } else {
      this.listSource = [{
        name: 'HIVE',
        value: 'HIVE'
      }];
    }
    this.doSearchFlow();
  }
}

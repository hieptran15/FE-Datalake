import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {Router} from '@angular/router';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {CallApiNifiService} from '../../@core/mock/callApiNifi.service';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-flows',
  templateUrl: './flows.component.html',
  styleUrls: ['./flows.component.scss']
})
export class FlowsComponent implements OnInit {
  @ViewChild('logDetail') logdetail: any
  logs = [];
  ids: String = '';
  item: String = '';
  nameFlow: String = '';
  nifiId: String = '';
  user_processgroup_id: String = '';
  ip: String = '';
  port: String = '';
  limits = [5, 10, 15, 20];
  limit = 10;
  rows = [];
  isLoading: boolean = false;
  columns = [
    {name: 'Nifi ID', prop: 'nifiId', flex: 1.2},
    {name: 'flow-customized.column.nameThread', prop: 'flowName', flex: 1.2},
    {name: 'flow-customized.column.ProcessorRunning', prop: 'processorRun', flex: 1},
    {name: 'flow-customized.column.ProcessorStop', prop: 'processorStop', flex: 1},
    {name: 'flow-customized.column.ProcessorInvalid', prop: 'processorIllegal', flex: 1},
    {name: 'Log', prop: 'log', flex: 0.5},
    {name: 'Link', prop: 'link', flex: 0.5}
  ];
  table = [];

  constructor(
    private router: Router,
    private dashboardSevices: CallApiNifiService,
    private shareData: ShareDataBreadcrumbService,
    public dialogService: NbDialogService) {
  }

  ngOnInit(): void {
    this.sendDataTest();
    this.getIp();
    this.getPort();
    this.getValueProcessGroupId();
    this.getAllFlow();
    this.table = [...this.rows]
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Utility',
      groupText: 'Ingestion & Provisioning',
      titleChild: 'Flow customized',
      urlPage: '/page/flows',
    })
  }

  getAllFlow() {
    let flowObj: Object = {
      nifiId: '',
      flowName: '',
      processorRun: '',
      processorStop: '',
      processorIllegal: '',
      log: '',
      link: ''
    };
    const arr = [];
    this.isLoading = true;
    this.dashboardSevices.getAllFlow().subscribe(res => {
      this.isLoading = false;
      console.log(res.body.processGroupFlow)
      res.body.processGroupFlow.flow.processGroups.forEach(i => {
        flowObj = {
          nifiId: i.id,
          flowName: i.status.name,
          processorRun: i.runningCount,
          processorStop: i.stoppedCount,
          processorIllegal: i.invalidCount,
          log: i.bulletins,
          link: this.ip + ':' + this.port + '/nifi/?processGroupId=' + i.id
        }
        arr.push(flowObj);
      })
      this.rows = [...arr];
      this.table = [...this.rows]
    })
  }

  getIp() {
    this.dashboardSevices.getValue('nifi_host').subscribe(res => {
      this.ip = res.body.results;
    })
  }

  getValueProcessGroupId() {
    this.dashboardSevices.getValue('user_processgroup_id').subscribe(res => {
      this.user_processgroup_id = res.body.results;
      console.log(this.user_processgroup_id);
    })
  }

  getPort() {
    this.dashboardSevices.getValue('nifi_port').subscribe(res => {
      this.port = res.body.results;
    })
  }

  filterFlow(event: any) {
    if (event.target.value !== '') {
      this.table = this.rows.filter(v => v.flowName.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1)
    } else {
      this.table = [...this.rows]
    }
  }

  showLog(index: number) {
    this.logs = [];
    const arr = [];
    let logObj: Object = {
      id: '', category: '', sourceName: '', level: '', message: '', timestamp: ''
    }
    if (this.table[index].log.length > 0) {
      this.table[index].log.forEach(i => {
        logObj = {
          id: i.bulletin.id,
          category: i.bulletin.category,
          level: i.bulletin.level,
          message: i.bulletin.message,
          timestamp: i.bulletin.timestamp
        }
        arr.push(logObj);
      })
      this.logs = [...arr];
    }
    this.nifiId = this.table[index].nifiId;
    this.dialogService.open(this.logdetail);
  }

  navigation(ref) {
    window.open('http://' + this.ip + ':' + this.port + '/nifi/?processGroupId=' + this.user_processgroup_id + '&componentIds=');

    ref.close();
  }

  navigationLink(index: number) {
    this.ids = this.table[index].nifiId;
    console.log(this.table[index].nifiId);
    window.open('http://' + this.ip + ':' + this.port + '/nifi/?processGroupId=' + this.ids);

  }

}


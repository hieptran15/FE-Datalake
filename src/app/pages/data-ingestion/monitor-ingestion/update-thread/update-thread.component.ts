import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataIngestionService} from '../../../../services/data-ingestion.service';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {AddThreadComponent} from '../add-thread/add-thread.component';
import * as Highcharts from 'highcharts';
import {IngestionDashboardSevices} from '../../../../@core/mock/ingestion-dashboard.sevices';
import {DatePipe} from '@angular/common';
import {CallApiNifiService} from '../../../../@core/mock/callApiNifi.service';
import {HttpClient} from '@angular/common/http';
import {LanguageService} from '../../../../@core/mock/language.service';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {AuthoritiesConstant} from '../../../../authorities.constant';

require('highcharts/themes/dark-blue')(Highcharts);

@Component({
  selector: 'ngx-update-thread',
  templateUrl: './update-thread.component.html',
  styleUrls: ['./update-thread.component.scss']
})
export class UpdateThreadComponent implements OnInit {
  flow;
  fptConnection;
  hdfsConnection;
  RDBMSconnection;
  HIVEconnection;
  Kafkaconnection;
  fptConnectionSink;
  checkSourceType;
  checkHdfs = 2
  checkFpt = 1;
  chartFile: any;
  showPasswordFTP = false;
  showPassword = false;
  authority = AuthoritiesConstant;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'column',
      backgroundColor: 'rgba(0,0,0,0)',
      border: 'none',
      borderWidth: 0
    },
    title: {
      text: '',
    },
    tooltip: {
      // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    xAxis: {
      gridLineWidth: 0.3,
      gridLineColor: 'gray',
      title: {
        text: ''
      },
      categories: [],
    },
    yAxis: {
      gridLineWidth: 0.3,
      gridLineColor: 'gray',
      title: {
        text: ''
      },
    },
    series: [
      {
        showInLegend: false,
        data: [],
        color: '#ff9800'
      },
    ],
  };
  chartOptions2 = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'line',
      backgroundColor: 'rgba(0,0,0,0)',
      border: 'none',
      borderWidth: 0
    },
    title: {
      text: '',
    },
    tooltip: {
      // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    xAxis: {
      gridLineWidth: 0.3,
      gridLineColor: 'gray',
      title: {
        text: ''
      },
      categories: [],
    },
    yAxis: {
      gridLineWidth: 0.3,
      gridLineColor: 'gray',
      title: {
        text: ''
      },
    },
    series: [
      {
        showInLegend: false,
        data: [],
        color: '#ff9800'
      },
    ],
  };
  chartUpdate = false;
  chartFiles = [];
  chartDatas = [];
  timeTypes = [
    {name: this.translateService.instant('monitor.day'), value: 2},
    {name: this.translateService.instant('monitor.week'), value: 0},
    {name: this.translateService.instant('monitor.month'), value: 1}
  ]
  date = [];
  timeType = 2;
  source = '';
  idFlow: number;
  logs = [];
  processGroupId = '';
  monitorProcessorId = '';

  constructor(private dashboardSevices: IngestionDashboardSevices,
              private route: ActivatedRoute,
              private dataIngestionService: DataIngestionService,
              public dialogService: NbDialogService,
              private router: Router,
              private callApiNifiService: CallApiNifiService,
              private toastrService: NbToastrService,
              private datePipe: DatePipe,
              private http: HttpClient,
              private languageService: LanguageService,
              private translateService: TranslateService
  ) {
  }

  ngOnInit()
    :
    void {
    this.loadData();
    this.langGet();
  }

  langGet() {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.timeTypes = [
        {name: this.translateService.instant('monitor.day'), value: 2},
        {name: this.translateService.instant('monitor.week'), value: 0},
        {name: this.translateService.instant('monitor.month'), value: 1}
      ]
    })
  }

  getInputTypeFTP() {
    if (this.showPasswordFTP) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPasswordFTP() {
    this.showPasswordFTP = !this.showPasswordFTP;
  }
  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  loadData(openPopup ?: boolean) {
    this.route.params.subscribe(param => {
      this.idFlow = param['id'];
      this.dataIngestionService.doSearchFlows({id: param['id']}).subscribe(res => {
        if (res.body.results && res.body.results.length) {
          this.flow = res.body.results.map(e => {
            const o = e.flowsEntity;
            o.groupName = e.processGroupEntity && e.processGroupEntity.groupName;
            this.source = o.sourceConnectionType;
            this.processGroupId = o.nifiProcessgroupId;
            this.monitorProcessorId = o.monitorProcessorId;
            this.newChart(param['id']);
            if (o.sourceConnectionType === 'FTP') {
              this.dataIngestionService.getOneFtpConnection({id: o.sourceConnectionId}).subscribe(source => {
                if (source.body.results && source.body.results.length) {
                  o.sourceConnectionName = source.body.results[0].connectionName;
                  this.fptConnection = source.body.results[0];
                  console.log(this.fptConnection)
                }
              });
            } else if (o.sourceConnectionType === 'RDBMS') {
              this.dataIngestionService.getOneRdbms({id: o.sourceConnectionId}).subscribe(source => {
                if (source.body.results && source.body.results.length) {
                  o.sourceConnectionName = source.body.results[0].connectionName;
                  this.RDBMSconnection = source.body.results[0]
                  console.log(this.RDBMSconnection)
                }
              });
            } else {
              this.dataIngestionService.getOneHIVE({id: o.sourceConnectionId}).subscribe(source => {
                if (source.body.results && source.body.results.length) {
                  o.sourceConnectionName = source.body.results[0].connectionName;
                  this.HIVEconnection = source.body.results[0]
                }
              });
            }
            o.sourceConfig = JSON.parse(o.sourceConfig);
            if (o.sinkConnectionType === 'HDFS') {
              this.dataIngestionService.getOneHdfsConnection({id: o.sinkConnectionId}).subscribe(source => {
                if (source.body.results && source.body.results.length) {
                  o.sinkConnectionName = source.body.results[0].connectionName;
                  o.hdfsResource = source.body.results[0].hdfsResource;
                  this.hdfsConnection = source.body.results[0]
                }
              });
            } else if (o.sinkConnectionType === 'Kafka') {
              this.dataIngestionService.getOneKafka({id: o.sinkConnectionId}).subscribe(source => {
                if (source.body.results && source.body.results.length) {
                  o.sinkConnectionName = source.body.results[0].connectionName;
                  this.Kafkaconnection = source.body.results[0]
                  console.log(this.Kafkaconnection)
                }
              });
            } else {
              this.dataIngestionService.getOneFtpConnection({id: o.sinkConnectionId}).subscribe(source => {
                if (source.body.results && source.body.results.length) {
                  o.sinkConnectionName = source.body.results[0].connectionName;
                  this.fptConnectionSink = source.body.results[0]
                  console.log(this.fptConnectionSink)
                }
              });
            }
            o.sinkConfig = JSON.parse(o.sinkConfig);
            return o;
          })[0];
          console.log('flow', this.flow)
          this.checkSourceType = this.flow.sourceConnectionType
          if (openPopup) {
            this.dialogService.open(AddThreadComponent, {
              closeOnBackdropClick: false,
              closeOnEsc: false,
              context: {
                flow: this.flow
              }
            }).onClose.subscribe(value => {
              if (value) {
                this.loadData();
              }
            });
          }
        } else {
          this.flow = null;
        }
      });
    });
  }

  editFlow() {
    const req = {
      id: this.flow.id,
      state: 'STOPPED',
      nifiProcessgroupId: this.flow.nifiProcessgroupId,
    }
    this.dataIngestionService.editFlowsState(req).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.loadData(true);
      } else {
        this.toastrService.danger(res.body.message, 'Error');
      }
    }, error => {
      this.toastrService.danger(error.error.message, 'Error');
    });
  }

  deleteFlow(ref) {
    const req = {
      id: this.flow.id,
      state: 'STOPPED',
      nifiProcessgroupId: this.flow.nifiProcessgroupId,
    }
    this.dataIngestionService.editFlowsState(req).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.loadData();
        if (this.checkSourceType === 'HIVE') {
          this.dataIngestionService.deleteFlowsHIVE(this.flow.id).subscribe(result => {
            if (result.body.responseType === 'SUCCESS') {
              this.toastrService.success(this.translateService.instant('success.http.deleteThreadSuccess'), this.translateService.instant('toast.note'));
              ref.close();
              this.router.navigate([`/pages/data-ingestion/monitor-ingestion`]);
            } else {
              this.toastrService.danger(this.translateService.instant('success.http.deleteThreadFail'), this.translateService.instant('toast.note'));
            }
          });
        } else {
          this.dataIngestionService.deleteFlows(this.flow.id).subscribe(result => {
            if (result.body.responseType === 'SUCCESS') {
              this.toastrService.success(this.translateService.instant('success.http.deleteThreadSuccess'), this.translateService.instant('toast.note'));
              ref.close();
              this.router.navigate([`/pages/data-ingestion/monitor-ingestion`]);
            } else {
              this.toastrService.danger(this.translateService.instant('success.http.deleteThreadFail'), this.translateService.instant('toast.note'));
            }
          });
        }
      } else {
        this.toastrService.danger(res.body.message, 'Error');
      }
    }, error => {
      this.toastrService.danger(error.error.message, 'Error');
    });
  }

  updateStateFlow(state, ref) {
    const req = {
      id: this.flow.id,
      state: state,
      nifiProcessgroupId: this.flow.nifiProcessgroupId,
    }
    this.dataIngestionService.editFlowsState(req).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success(this.translateService.instant('toast.successfulStreamStatusUpdate'), this.translateService.instant('toast.note'));
        this.loadData();
        ref.close();
      } else {
        this.toastrService.danger(this.translateService.instant('toast.errorStreamStatusUpdate'), this.translateService.instant('toast.note'));
      }
    });
  }

  newChart(id ?) {
    this.chartDatas = [];
    this.chartFiles = [];
    this.date = [];
    if (this.timeType === 2) {
      this.chartOptions.title.text = 'Biểu đồ lưu lượng theo ngày';
      this.chartOptions2.title.text = 'Biểu đồ File theo ngày';
      this.getChartDay();
    } else {
      if (this.timeType === 0) {
        this.chartOptions.title.text = 'Biểu đồ lưu lượng theo tuần';
        this.chartOptions2.title.text = 'Biểu đồ File theo tuần';
      } else if (this.timeType === 1) {
        this.chartOptions.title.text = 'Biểu đồ lưu lượng theo tháng';
        this.chartOptions2.title.text = 'Biểu đồ File theo tháng';
      }
      this.dashboardSevices.getChartById(this.timeType, this.source, id).subscribe(
        res => {
          res.body.forEach(
            i => {
              this.date.push(this.getDateStr(new Date(i.x)))
              this.chartFiles.push(i.y2)
              this.chartDatas.push(i.y1)
            }
          )
          this.chartOptions.series[0].data = this.chartDatas;
          this.chartOptions.xAxis.categories = this.date;
          this.chartOptions2.series[0].data = this.chartFiles;
          this.chartOptions2.xAxis.categories = this.date;
          this.chartUpdate = true;
        }
      )
    }
  }

  getDateStr(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  getLog() {
    this.logs = [];
    const logObj: Object = {
      timestamp: '', level: '', category: '', sourceName: '', message: ''
    }
    this.callApiNifiService.getLog(this.processGroupId).subscribe(
      res => {
        if (res.body['bulletins']) {
          if (res.body['bulletins'].length > 0) {
            const bulletins = res.body['bulletins']
            bulletins.forEach(i => {
                if (i['bulletin']) {
                  const bulletin = i['bulletin']
                  logObj['timestamp'] = bulletin['timestamp']
                  logObj['level'] = bulletin['level']
                  logObj['category'] = bulletin['category']
                  logObj['sourceName'] = bulletin['sourceName']
                  logObj['message'] = bulletin['message']
                  this.logs.push(logObj)
                }
              }
            )
          }
        }
      }
    )
  }

  getChartDay() {
    this.chartDatas = [];
    this.chartFiles = [];
    let date: Date;
    let aggregateSnapshots = [];
    const output = [
      {byte: 0, data: 0, date: null},
      {byte: 0, data: 0, date: null},
      {byte: 0, data: 0, date: null},
      {
        byte: 0,
        data: 0,
        date: null
      },
      {byte: 0, data: 0, date: null},
      {byte: 0, data: 0, date: null},
      {byte: 0, data: 0, date: null},
      {
        byte: 0,
        data: 0,
        date: null
      }, {byte: 0, data: 0, date: null}, {byte: 0, data: 0, date: null}, {byte: 0, data: 0, date: null}, {
        byte: 0,
        data: 0,
        date: null
      }, {byte: 0, data: 0, date: null}, {byte: 0, data: 0, date: null}, {byte: 0, data: 0, date: null}, {
        byte: 0,
        data: 0,
        date: null
      }, {byte: 0, data: 0, date: null}, {byte: 0, data: 0, date: null}, {byte: 0, data: 0, date: null}, {
        byte: 0,
        data: 0,
        date: null
      }, {byte: 0, data: 0, date: null}, {byte: 0, data: 0, date: null}, {byte: 0, data: 0, date: null}, {
        byte: 0,
        data: 0,
        date: null
      }];
    const outputBytes = [];
    const outputsData = [];
    const categoriesDate = [];
    this.callApiNifiService.getChartDay(this.monitorProcessorId).subscribe(
      res => {
        aggregateSnapshots = res.body?.statusHistory?.aggregateSnapshots
        if (aggregateSnapshots) {
          aggregateSnapshots.forEach(
            i => {
              date = new Date(Number(i.timestamp));
              switch (date.getHours()) {
                case 0:
                  output[0]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[0]['data'] += Number(i.statusMetrics.outputCount)
                  output[0]['date'] = this.getDate(date)
                  break;
                case 1:
                  output[1]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[1]['data'] += Number(i.statusMetrics.outputCount)
                  output[1]['date'] = this.getDate(date)
                  break;
                case 2:
                  output[2]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[2]['data'] += Number(i.statusMetrics.outputCount)
                  output[2]['date'] = this.getDate(date)
                  break;
                case 3:
                  output[3]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[3]['data'] += Number(i.statusMetrics.outputCount)
                  output[3]['date'] = this.getDate(date)
                  break;
                case 4:
                  output[4]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[4]['data'] += Number(i.statusMetrics.outputCount)
                  output[4]['date'] = this.getDate(date)
                  break;
                case 5:
                  output[5]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[5]['data'] += Number(i.statusMetrics.outputCount)
                  output[5]['date'] = this.getDate(date)
                  break;
                case 6:
                  output[6]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[6]['data'] += Number(i.statusMetrics.outputCount)
                  output[6]['date'] = this.getDate(date)
                  break;
                case 7:
                  output[7]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[7]['data'] += Number(i.statusMetrics.outputCount)
                  output[7]['date'] = this.getDate(date)
                  break;
                case 8:
                  output[8]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[8]['data'] += Number(i.statusMetrics.outputCount)
                  output[8]['date'] = this.getDate(date)
                  break;
                case 9:
                  output[9]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[9]['data'] += Number(i.statusMetrics.outputCount)
                  output[9]['date'] = this.getDate(date)
                  break;
                case 10:
                  output[10]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[10]['data'] += Number(i.statusMetrics.outputCount)
                  output[10]['date'] = this.getDate(date)
                  break;
                case 11:
                  output[11]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[11]['data'] += Number(i.statusMetrics.outputCount)
                  output[11]['date'] = this.getDate(date)
                  break;
                case 12:
                  output[12]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[12]['data'] += Number(i.statusMetrics.outputCount)
                  output[12]['date'] = this.getDate(date)
                  break;
                case 13:
                  output[13]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[13]['data'] += Number(i.statusMetrics.outputCount)
                  output[13]['date'] = this.getDate(date)
                  break;
                case 14:
                  output[14]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[14]['data'] += Number(i.statusMetrics.outputCount)
                  output[14]['date'] = this.getDate(date)
                  break;
                case 15:
                  output[15]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[15]['data'] += Number(i.statusMetrics.outputCount)
                  output[15]['date'] = this.getDate(date)
                  break;
                case 16:
                  output[16]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[16]['data'] += Number(i.statusMetrics.outputCount)
                  output[16]['date'] = this.getDate(date)
                  break;
                case 17:
                  output[17]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[17]['data'] += Number(i.statusMetrics.outputCount)
                  output[17]['date'] = this.getDate(date)
                  break;
                case 18:
                  output[18]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[18]['data'] += Number(i.statusMetrics.outputCount)
                  output[18]['date'] = this.getDate(date)
                  break;
                case 19:
                  output[19]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[19]['data'] += Number(i.statusMetrics.outputCount)
                  output[19]['date'] = this.getDate(date)
                  break;
                case 20:
                  output[20]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[20]['data'] += Number(i.statusMetrics.outputCount)
                  output[20]['date'] = this.getDate(date)
                  break;
                case 21:
                  output[21]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[21]['data'] += Number(i.statusMetrics.outputCount)
                  output[21]['date'] = this.getDate(date)
                  break;
                case 22:
                  output[22]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[22]['data'] += Number(i.statusMetrics.outputCount)
                  output[22]['date'] = this.getDate(date)
                  break;
                case 23:
                  output[23]['byte'] += Number(i.statusMetrics.outputBytes)
                  output[23]['data'] += Number(i.statusMetrics.outputCount)
                  output[23]['date'] = this.getDate(date)
                  break;
              }
            }
          )
          output.sort((a, b) => {
            const nameA = a['date'].toUpperCase();
            const nameB = b['date'].toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          output.forEach(
            i => {
              outputBytes.push(i['byte'])
              outputsData.push(i['data'])
              categoriesDate.push(i['date'])
            }
          )
          this.chartOptions.series[0].data = outputBytes;
          this.chartOptions.xAxis.categories = categoriesDate;
          this.chartOptions2.series[0].data = outputsData;
          this.chartOptions2.xAxis.categories = categoriesDate;
          this.chartUpdate = true;
        }
      }
    )
  }

  getDate(date: Date):
    string {
    return this.datePipe.transform(date, 'dd/MM/yyyy HH');
  }
}

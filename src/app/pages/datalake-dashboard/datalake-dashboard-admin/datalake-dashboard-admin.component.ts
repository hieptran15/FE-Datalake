import {
  AfterViewInit,
  Component,
  ElementRef, Input,
  OnInit, Pipe, PipeTransform,
  ViewChild,
} from '@angular/core';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import * as Highcharts from 'highcharts';
import {Router} from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs';
import * as fileSaver from 'file-saver';
import {ShareDataBreadcrumbService} from '../../../services/share-data-breadcrumb.service';
import {SupportRequestService} from '../../../services/support-request.service';
import {DatalakeDashboardService} from '../../../services/datalake-dashboard.service';
import {AccountService} from '../../../@core/auth/account.service';
import {PopupErrorComponent} from '../../popup-error/popup-error.component';


@Component({
  selector: 'ngx-datalake-dashboard-admin',
  templateUrl: './datalake-dashboard-admin.component.html',
  styleUrls: ['./datalake-dashboard-admin.component.scss']
})
export class DatalakeDashboardAdminComponent implements OnInit, AfterViewInit {
  @Input('dashboardValue') dashboardValue: any;
  limit: any;
  rowData: any;
  listSR: any;
  columnsTable: any;
  columnsTable2: any;
  base64File;
  dataCache: any;
  Highcharts: typeof Highcharts = Highcharts;
  chartDatas = [];
  chartFiles = [];
  chartDatas2 = [];
  chartFile2 = [];
  listCmCluster = [];
  listDashBoard: any;
  Dashboard: any;

  defaultUse = 0;
  defaultNumber = 0;
  defaultUseBlock = 0;
  defaultTotalBlock = 0;
  defaultNameUse = 0;
  defaultNameTotal = 0;

  defaultVolumeUse = 0;
  defaultVolumeTotal = 0;

  dataUseNumber = new BehaviorSubject(0);
  dataDetailNumber = new BehaviorSubject(0);

  @ViewChild('chartLeft') chartLeft: ElementRef;
  @ViewChild('chartRight') chartRight: ElementRef;
  @ViewChild('tableSR') tableSR: ElementRef
  // @ts-ignore
  chartOptions: any;
  formGroupLB: FormGroup = this.fb.group({
    userId: [null, [Validators.required]],
    startDate: [null],
    endDate: [null],
    rpAppId: [null, [Validators.required]],
    userIpId: [null],
    rpAppThriftId: [null],
    type: [null],
    reason: [null],
    fileName: [null],
    status: [null],
  });

  chartOptions2: any;
  chartUpdate = true;
  formGroupDashboard: any;
  ListStatusDashboard: any;
  formGroupSR: any;
  listTypeSr = [
    {name: 'LB connection', key: 'lb_connection'},
    {
      name: 'Thrift connection',
      key: 'thrift_connection',
    },
    {name: 'Iptables ', key: 'iptables'},
  ];

  listStatusSr = [
    {name: 'Waiting', key: 'waiting'},
    {
      name: 'Completed',
      key: 'completed',
    },
    {name: 'Rejected', key: 'rejected'},
    {name: 'Invalid', key: 'invalid'},
    {
      name: 'Approved',
      key: 'approved',
    },
    {name: 'Archived', key: 'archived'},
  ];
  ListThriftRPApp: any;
  isFileUrl: any;
  totalLast6Month1: any;
  totalLast6Month2: any;
  listAllRpApp: any;
  listThrift: any;
  listAllServer: any;

  // check block data number %
  checkDataNodeNumber = new BehaviorSubject(10);
  checkNameNodeNumber = new BehaviorSubject(40);
  checkDataVolumeNumber = new BehaviorSubject(50);
  checkdataBlockNumber = new BehaviorSubject(60);

  constructor(
    public dialogService: NbDialogService,
    private shareData: ShareDataBreadcrumbService,
    private fb: FormBuilder,
    private Route: Router,
    public supportRequestService: SupportRequestService,
    public datalakeDashboardService: DatalakeDashboardService,
    private translate: TranslateService,
    private toastrService: NbToastrService,
    private accountService: AccountService
  ) {
  }

  ngOnInit(): void {
    this.getListWpThrift();
    this.getCmCluster();
    this.totalLast6Month1 = this.totalLast6Month2 = 0;
    for (let i = 0; i < 15; i++) {
      const number = Math.random() * 100;
      this.totalLast6Month1 += Number.parseInt(number.toString(), 10);
      this.chartDatas.push(number);
    }
    for (let i = 0; i < 15; i++) {
      const number = Math.random() * 100;
      this.totalLast6Month2 += Number.parseInt(number.toString(), 10);
      this.chartFiles.push(number);
    }

    for (let i = 0; i < 6; i++) {
      const number = Math.random() * 100;
      this.chartDatas2.push(number);
    }
    for (let i = 0; i < 6; i++) {
      const number = Math.random() * 100;
      this.chartFile2.push(number);
    }
    this.chartOptions2 = {
      chart: {
        renderTo: 'chart',
        height: 150,
        type: 'line',
        backgroundColor: 'rgba(0,0,0,0)',
        border: 'none',
        borderWidth: 0,
      },
      title: {
        text: '',
        style: {
          color: '#E2E7E7',
          fontSize: '15px',
        },
      },
      xAxis: {
        type: 'categories',
        categories: ['01', '02', '03', '04', '05', '06'],
      },
      yAxis: {
        title: {
          text: undefined,
        },
        tickAmount: 4,
        tickLength: 0,
        gridLineColor: '#E2E7E7',
        gridLineDashStyle: 'dash',
        labels: {
          formatter: function () {
            return null;
          },
        },
      },
      series: [
        {
          pointStart: 0,
          data: this.chartDatas2,
          color: '#E6E8EC',
          fill: 'none',
          showInLegend: true,
          name: '<div class="legend-chart-right"><span>Last 6 days</span></div>'

        },
        {
          pointStart: 0,
          data: this.chartFile2,
          color: '#FFC300',
          fill: 'none',
          showInLegend: true,
          name: '<div class="legend-chart-right"><span>Last week</span></div>'

        },
      ],
      legend: {
        backgroundColor: 'transparent',
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'bottom',
        useHTML: true,
        x: 0,
        y: 0,
        title: {
          style: {}
        }
      },
    };
    this.chartOptions = {
      chart: {
        renderTo: 'chart',
        height: 250,
        type: 'spline',
        backgroundColor: 'rgba(0,0,0,0)',
        border: 'none',
        borderWidth: 0,
      },
      title: {
        text: '<div class="title-chart-left"><span>Kafka Throughput</span><span>Nov - July</span></div>',
        useHTML: true,
        align: 'left',
        style: {
          color: 'white',
          fontSize: '15px',
          tickLength: 0,
          gridLineColor: 'transparent',
        },
      },

      tooltip: {
        // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        visible: false,
      },
      xAxis: {
        // type: 'datetime',
        type: 'categories',
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
          'Jan',
          'Feb',
          'Mar',
        ],
        tickLength: 0,
        gridLineWidth: 1,
        gridLineColor: '#33334B',
        tickInterval: 1,
        // dateTimeLabelFormats: {
        //   day: '%b',
        //   month: '%b',
        //   year: '%Y'
        // },
        // labels: {
        //   format: '{value:%b}'
        // },
      },
      // plotOptions: {
      //   series: {
      //     pointStart: Date.UTC(2020, 0),
      //     pointInterval: 24 * 3600 * 1000 * 31 // one day
      //   }
      // },
      // xAxis: {
      //   type: 'datetime',
      //   tickLength: 0,
      //   gridLineWidth: 1,
      //   gridLineColor: '#33334B',
      //   tickInterval: 1,
      //   tickAmount: 8,
      //   labels: {
      //     format: '{value:%b}'
      //   },
      // },

      // plotOptions: {
      //   series: {
      //     pointStart: Date.UTC(2021, 0, 1),
      //     pointInterval: 24 * 3600 * 1000 * 31 // one day
      //   }
      // },
      yAxis: {
        title: {
          text: undefined,
        },
        tickAmount: 4,
        tickLength: 0,
        gridLineColor: 'transparent',
      },
      series: [
        {
          //     pointStart: Date.UTC(2021, 0, 1),
          showInLegend: true,
          name: '<div class="legend-chart-left"><span>LAST 6 MONTHS</span><span>' + this.totalLast6Month1 + '</span></div>',

          data: this.chartDatas,
          color: '#4BDE97',
          fill: 'none',
        },
        {
          showInLegend: true,
          name: '<div class="legend-chart-left"><span>PREVIOUS</span><span>' + this.totalLast6Month2 + '</span></div>',
          data: this.chartFiles,
          color: '#0F70F5',
          fill: 'none',
        },
      ],
      legend: {
        backgroundColor: 'transparent',
        align: 'right',
        verticalAlign: 'top',
        useHTML: true,
        x: 0,
        y: -50,

        title: {
          style: {}
        }
      },

    };
    this.getAllSR();
    this.LengthAlert.next(15);
    this.listDashBoard = [
      {
        id: 1,
        name: 1,
      },
      {
        id: 2,
        name: 2,
      },
      {id: 3, name: 3},
    ];
    this.formGroupDashboard = this.fb.group({
      Service: null,
      Source: null,
      Status: null,
      SDT: null,
      Causal: null,
      Desp: null,
    });
    this.formGroupSR = this.fb.group({
      code_SR: [null],
      title: [null],
      typeSr: [null],
      createBy: [null],
      status: [null],
      fileName: [null],
      thrift: [null],
      dateCreate: [null],
      dateEnd: [null],
      inactiveAt: [null],
      info: [null],
      fileListUser: [null],
      descriptions: [null],
      userHandler: [null],
      srCensorId: [null],
      userMapping: [null],
      // server: ['', Validators.required],
      // port: ['', Validators.required],
      // rp_app: ['', Validators.required],
      // directory: ['', Validators.required],
    });
    this.columnsTable = [
      {name: 'Stt', prop: 'id'},
      {name: 'Nội dung', prop: 'Service'},
      {name: 'Nội dung', prop: 'Source'},
      {name: 'Action ', prop: 'action'},
    ];
    this.columnsTable2 = [
      {name: 'Index', prop: 'stt', flexGrow: 0.5},
      {name: 'Người gửi', prop: 'userSendRequest', flexGrow: 0.9},
      {name: 'Loại SR', prop: 'type', flexGrow: 0.9},
      {name: 'Action', prop: 'action', flexGrow: 0.8},
    ];

    this.rowData = [
      {
        id: 1,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      },
      {
        id: 2,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      },
      {
        id: 3,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      },
      {
        id: 4,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      },
      {
        id: 5,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      },
      {
        id: 6,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      },
      {
        id: 7,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      },
      {
        id: 8,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      },
      {
        id: 20,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      }, {
        id: 9,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      },
      {
        id: 10,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      }, {
        id: 11,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      },
      {
        id: 12,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      }, {
        id: 13,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      }, {
        id: 14,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      },
      {
        id: 15,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      },
      {
        id: 16,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      },
      {
        id: 17,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      }, {
        id: 18,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      }, {
        id: 19,
        Service: 'nem',
        Source: 'nem',
        Status: 'true',
        SDT: '123124',
        Causal: 'nem',
        Desp: 'nem',
      },


    ]

  }

  ngAfterViewInit() {
    // console.log('chart right :', this.chartRight.nativeElement);
    // console.log('chart left :', this.chartLeft.nativeElement.width);
    console.log('table sr :', this.tableSR);
  }

  getRowDataTable(row: any) {
  }

  getCmCluster() {
    this.datalakeDashboardService.getCmCluster().subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.listCmCluster = res.body.results;
        this.Dashboard = this.listCmCluster[0]?.clusterName;
        this.checkDataBlock(this.Dashboard);
        this.checkDataNode(this.Dashboard);
        this.checkDataVolume(this.Dashboard);
        this.checkNameNode(this.Dashboard);
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
    });
  }

  OpenPopup(form: any, data?: any) {
    this.formGroupDashboard.setValue({
      Service: data.Service,
      Source: data.Source,
      Status: data.Status,
      SDT: data.SDT,
      Causal: data.Causal,
      Desp: data.Desp,
    });
    this.dialogService.open(form, {
      // context: {title: text},
      closeOnBackdropClick: false,
    });
  }

  ActionFormGroupDashboard(ref: any) {
  }

  openDetailSR(ref: any, data: any) {

    this.formGroupSR.reset();
    console.log('data', data);
    console.log('keys : ', Object.keys(data.data));
    // console.log('info:', data.data.info);
    this.dialogService.open(ref, {
      // context: {title: text},
      closeOnBackdropClick: false,
    });
    const data_info = JSON.parse(data.data.info);
    let thrift_match;
    if (data.data.type === 'iptables') {
      thrift_match = '';
    } else if (data.data.type === 'lb_connection') {
      thrift_match = this.listThrift.filter(x => x.id === data_info.wpThriftId);
    } else {
      thrift_match = this.listThrift.filter(x => x.id === data_info.thriftId);
    }

    this.formGroupSR.setValue({
      code_SR: data.data?.id,
      title: data.data?.title,
      typeSr: data.data?.type,
      createBy: data.data?.userSendRequest,
      status: data.data?.status,
      fileName: data.data?.fileUrl,
      thrift: thrift_match[0]?.name ? thrift_match[0]?.name : '',
      dateCreate: this.dateFormatSR(data.data?.createAt),
      dateEnd: '',
      inactiveAt: '',
      info: data.data?.info,
      fileListUser: data.data?.fileListUser,
      descriptions: data.data?.description,
      userHandler: data.data?.listUserHandler,
      srCensorId: data.data?.srCensorId,
      userMapping: data.data?.listUserMapping,
      // server: ['', Validators.required],
      // port: ['', Validators.required],
      // rp_app: '',
      // directory: '',
    });
  }

  onFileChange(event: Event) {
    let file;
    file = event.target['files'][0];
    this.base64File = file;
    // this.formGroupLB.get("fileName").patchValue(file.name);
    this.formGroupSR.get('fileName').patchValue(file.name);
  }

  // check dropdown dashboard
  LengthSR = new BehaviorSubject(0);
  LengthAlert = new BehaviorSubject(0);

  checkDashboard(): void {
    if (this.Dashboard) {
      this.checkDataBlock(this.Dashboard);
      this.checkDataNode(this.Dashboard);
      this.checkDataVolume(this.Dashboard);
      this.checkNameNode(this.Dashboard);
    }
  }

  getAllSR(): void {
    const options = {
      keyStatus: '',
      keyUserHandler: '',
      keyUserSend: '',
      typeSr: '',
      keySearch: '',
    };
    // this.sendDataBreadcrumb();
    // this.getAllSupportRequestInfo(options);
    this.datalakeDashboardService.LoadingSRFromDashboard('approved').subscribe(
      (res) => {
        if (res.body.responseType === 'SUCCESS') {


          this.listSR = res.body.results;
          this.LengthSR.next(this.listSR.length);
        } else {
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.body.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
        }
      }, error => {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error.error.detail},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    )
  }

  redirectToSR(data: any) {

    this.accountService.accountCache$.subscribe(res => {
      if (res.login === 'admin') {
        console.log(data.data);
        const url = 'page/support-request/request-details/' + data.data.id;
        this.Route.navigateByUrl(url);
      } else {
        this.toastrService.danger('Fail ', 'chi admin moi duoc redict  ');
      }
    }, error => {
      this.toastrService.danger('fail', error.error.message)
    })
  }

  dateFormatSR(date) {
    const dateInputs = new Date(date);
    const dateStringOutPut =
      dateInputs.getFullYear() +
      '-' +
      ('0' + (dateInputs.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + dateInputs.getDate()).slice(-2) +
      ' ' +
      ('0' + dateInputs.getHours()).slice(-2) +
      ':' +
      ('0' + dateInputs.getMinutes()).slice(-2) +
      ':' +
      ('0' + dateInputs.getSeconds()).slice(-2);
    return dateStringOutPut;
  }


  // get all thrift with dropdown
  getListWpThrift() {
    this.supportRequestService.getListWpThrift().subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        this.listThrift = res.body.results;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    });
  }

  // get all rb-app list
  getAllLbRpApp() {
    this.supportRequestService.getAllLbRpApp().subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        this.listAllRpApp = res.body.results;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    });
  }

  // get list server
  getListServer() {
    this.supportRequestService.getListServer().subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        this.listAllServer = res.body.results;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    });
  }

  clearFileName() {
    this.formGroupSR.get('fileName').patchValue('');
  }

  // load data number progress
  // isAdmin = new BehaviorSubject(false);


  checkDataNode(data?: any) {
    this.datalakeDashboardService.checkDataNode(data).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {

        // this.dataUseNumber.next(res.body.result[0].use);
        // this.dataDetailNumber.next(res.body.result[0].detail);
        this.defaultUse = res.body.results[0].use;
        this.defaultNumber = res.body.results[0].total;

        this.checkDataNodeNumber.next(Number.parseInt(res.body.results[0].result, 10));
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    })
    // this.defaultUse = 1000000000000000000;
    // this.defaultNumber = 10000000000000000;
  }

  checkNameNode(data?: any) {
    this.datalakeDashboardService.checkNameNode(data).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {

        this.defaultNameUse = res.body.results[0].use;
        this.defaultNameTotal = res.body.results[0].total;
        this.checkNameNodeNumber.next(Number.parseInt(res.body.results[0].result, 10));
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    })
    // this.defaultNameUse = 12000000000000000000;
    // this.defaultNameTotal = 120000000000000000;
  }

  checkDataVolume(data?: any) {
    this.datalakeDashboardService.checkDataVolume(data).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {

        this.defaultVolumeUse = res.body.results[0].use;
        this.defaultVolumeTotal = res.body.results[0].total;
        this.checkDataVolumeNumber.next(Number.parseInt(res.body.results[0].result, 10));
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    })
    // this.defaultVolumeUse = 13000000000000000000;
    // this.defaultVolumeTotal = 130000000000000000;
  }

  checkDataBlock(data?: any) {
    this.datalakeDashboardService.checkDataBlock(data).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.defaultUseBlock = res.body.results[0].use;
        this.defaultTotalBlock = res.body.results[0].total;
        this.checkdataBlockNumber.next(Number.parseInt(res.body.results[0].result, 10));
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    })
    // this.defaultUseBlock = 14000000000000000000;
    // this.defaultTotalBlock = 140000000000000000;
  }

  downloadFile(row?: any) {
    const fileName = this.formGroupSR.controls['fileName'].value;

    this.datalakeDashboardService.downloadFileDashboard(fileName).subscribe(
      (res) => {
        console.log(res);
        const blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        fileSaver.saveAs(blob, row.fileUrl);
      },
      (error) => {
        this.toastrService.danger('fail', error.error.message);
      }
    );
  }

  downloadFileUser(row?: any) {

    // console.log('file', this.formGroupSR.controls['fileListUser'].value);
    const fileName = this.formGroupSR.controls['fileListUser'].value;

    this.supportRequestService.downloadFile(fileName).subscribe(
      (res) => {
        console.log(res);
        const blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        fileSaver.saveAs(blob, row.fileUrl);
      },
      (error) => {
        this.toastrService.danger('fail', 'download file khong thanh cong ');
      }
    );
  }

  checkLengthNumber(num1: number, num2: number) {
    if (num1.toString().length > 4 || num2.toString().length > 4)
      return true;
    else return false;
  }

}

import {Component, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';

require('highcharts/themes/dark-blue')(Highcharts);
import {IngestionDashboardSevices} from '../../../@core/mock/ingestion-dashboard.sevices';
import {DatePipe} from '@angular/common';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {LanguageService} from '../../../@core/mock/language.service';
import {AccountService} from '../../../@core/auth/account.service';
import {ShareDataBreadcrumbService} from '../../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  listSource = ['FTP', 'RDBMS', 'Kafka', 'HDFS'];
  listTypeDataChart = [{name: 'Ingestion', value: null}, {name: 'Provisioning', value: true}];
  valueChoose = 'Ingestion';
  valueChooseDefault = null;
  source;
  timeType;
  checkerrorServer: boolean = false;
  changeColor: string;
  chartUpdate = false;
  chartFiles = [];
  chartDatas = [];
  date = [];
  listTimeType = [{
    name: this.translateService.instant('monitor.week'),
    value: 0
  }, {name: this.translateService.instant('monitor.month'), value: 1}];
  Highcharts: typeof Highcharts = Highcharts;
  // @ts-ignore
  chartOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'line',
      backgroundColor: 'rgba(0,0,0,0)',
      border: 'none',
      borderWidth: 0
    },
    legend: {
      backgroundColor: 'transparent'
    },
    title: {
      text: '',
      style: {
        color: 'white',
        fontSize: '15px'
      }
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
      lineWidth: 2
    },
    yAxis: {
      gridLineWidth: 0.3,
      gridLineColor: 'gray',
      title: {
        text: ''
      },
      lineWidth: 2
    },
    series: [
      {
        data: this.chartDatas,
        name: 'Date',
        color: '#ff9800',
        fill: 'none'
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
      borderWidth: 0
    },
    legend: {
      backgroundColor: 'transparent'
    },
    title: {
      text: '',
      style: {
        color: 'white',
        fontSize: '15px'
      }
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
      lineWidth: 2
    },
    yAxis: {
      gridLineWidth: 0.3,
      gridLineColor: 'gray',
      title: {
        text: ''
      },
      lineWidth: 2
    },
    series: [
      {
        data: this.chartFiles,
        name: 'File count',
        color: '#ff9800'
      },
    ]
  };

  constructor(private dashboardSevices: IngestionDashboardSevices, private languageService: LanguageService, private translateService: TranslateService,
              private datePipe: DatePipe, private accountService: AccountService, private shareData: ShareDataBreadcrumbService) {
  }

  ngOnInit(): void {
    this.sendDataTest();
    this.source = 'FTP';
    this.timeType = 0;
    this.newChart();
    this.langGet();
    ;
    this.accountService.identity().subscribe(res => {
        if (res === null) {
          this.checkerrorServer = true;
        } else {
          this.checkerrorServer = false;
        }
      }
    )
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Utility',
      groupText: 'Ingestion & Provisioning',
      titleChild: 'Monitor',
      urlPage: '/page/data-ingestion/dashboard',
    })
  }

  langGet() {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.listTimeType = [{
        name: this.translateService.instant('monitor.week'),
        value: 0
      }, {name: this.translateService.instant('monitor.month'), value: 1}];
      this.chartOptions.title.text = this.translateService.instant('monitor.weeklyFlowChart');
      this.chartOptions2.title.text = this.translateService.instant('monitor.monthlyFlowChart');
      this.chartOptions = JSON.parse(JSON.stringify(this.chartOptions));
      this.chartOptions2 = JSON.parse(JSON.stringify(this.chartOptions2));
    })
  }

  newChart() {
    this.chartDatas = [];
    this.chartFiles = [];
    this.date = [];
    const dates = [];
    const datas = [];
    const files = [];
    if (this.timeType === 0) {
      this.chartOptions.title.text = this.translateService.instant('monitor.weeklyFlowChart');
      this.chartOptions2.title.text = this.translateService.instant('monitor.monthlyFlowChart');
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      this.chartOptions = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'line',
          backgroundColor: 'rgba(0,0,0,0)',
          border: 'none',
          borderWidth: 0
        },
        legend: {
          backgroundColor: 'transparent'
        },
        title: {
          text: 'Biểu đồ lưu lượng theo tuần',
          style: {
            color: 'white',
            fontSize: '15px'
          }
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
          lineWidth: 2
        },
        yAxis: {
          gridLineWidth: 0.3,
          gridLineColor: 'gray',
          title: {
            text: ''
          },
          lineWidth: 2
        },
        series: [
          {
            data: this.chartDatas,
            name: 'Date',
            color: '#ff9800',
            fill: 'none'
          },
        ],
      };
      this.chartOptions2 = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'line',
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 0
        },
        legend: {
          backgroundColor: 'transparent'
        },
        title: {
          text: 'Biểu đồ file theo tuần',
          style: {
            color: 'white',
            fontSize: '15px'
          }
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
          lineWidth: 2
        },
        yAxis: {
          gridLineWidth: 0.3,
          gridLineColor: 'gray',
          title: {
            text: ''
          },
          lineWidth: 2
        },
        series: [
          {
            data: this.chartFiles,
            name: 'File count',
            color: '#ff9800'
          },
        ]
      };
    } else if (this.timeType === 1) {
      this.chartOptions.title.text = 'Biểu đồ lưu lượng theo tháng';
      this.chartOptions2.title.text = 'Biểu đồ file theo tháng';
      this.chartOptions = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'line',
          backgroundColor: 'rgba(0,0,0,0)',
          border: 'none',
          borderWidth: 0
        },
        legend: {
          backgroundColor: 'transparent'
        },
        title: {
          text: 'Biểu đồ lưu lượng theo tháng',
          style: {
            color: 'white',
            fontSize: '15px'
          }
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
          lineWidth: 2
        },
        yAxis: {
          gridLineWidth: 0.3,
          gridLineColor: 'gray',
          title: {
            text: ''
          },
          lineWidth: 2
        },
        series: [
          {
            data: this.chartDatas,
            name: 'Date',
            color: 'yellow',
            fill: 'none',
          },
        ],
      };
      this.chartOptions2 = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'line',
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 0
        },
        legend: {
          backgroundColor: 'transparent'
        },
        title: {
          text: 'Biểu đồ file theo tháng',
          style: {
            color: 'white',
            fontSize: '15px'
          }
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
          lineWidth: 2
        },
        yAxis: {
          gridLineWidth: 0.3,
          gridLineColor: 'gray',
          title: {
            text: ''
          },
          lineWidth: 2
        },
        series: [
          {
            data: this.chartFiles,
            name: 'File count',
            color: 'yellow'
          },
        ]
      };
    }
    this.dashboardSevices.getChart(this.valueChooseDefault, this.timeType, this.source).subscribe(
      res => {
        res.body.forEach(
          i => {
            dates.push(this.getDateStr(new Date(i.x)))
            this.date = dates;
            files.push(i.y2)
            this.chartFiles = [...files];
            datas.push(i.y1)
            this.chartDatas = [...datas];
          }
        )
        this.chartOptions.series[0].data = this.chartDatas;
        this.chartOptions.xAxis.categories = this.date;
        this.chartOptions2.series[0].data = this.chartFiles;
        this.chartOptions2.xAxis.categories = this.date;
        this.chartUpdate = true;
        this.langGet()
      }, (error) => {
        console.log('error', error)
      }
    )
  }

  getDateStr(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  setTypeDataChart(item) {
    if (item?.name === 'Ingestion') {
      this.listSource = ['FTP', 'RDBMS', 'Kafka', 'HDFS'];
      this.source = this.listSource[0];
    } else {
      this.listSource = ['HIVE'];
      this.source = this.listSource[0];
    }
    this.valueChooseDefault = item?.value;
    this.newChart();
  }
}

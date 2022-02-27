import {Component, Input, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'ngx-datalake-dashboard-user',
  templateUrl: './datalake-dashboard-user.component.html',
  styleUrls: ['./datalake-dashboard-user.component.scss']
})
export class DatalakeDashboardUserComponent implements OnInit {
  chartOptions1: any;
  chartOptions2: any;
  chartUpdate = true;
  Highcharts: typeof Highcharts = Highcharts;
  @Input('dashboardValue') dashboardValue: any;

  constructor() {
  }

  ngOnInit(): void {
    this.chartOptions1 = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
      },
      title: {
        text: '<div class="title-chart-total"><span>4930</span><span style="color: var(--color-text-light); font-size: 14px; font-weight: normal; margin-top: 5px">Total</span></div>',
        align: 'center',
        verticalAlign: 'middle',
        y: 20,
        useHTML: true
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      legend: {
        reversed: true,
        symbolRadius: 0,
        itemMarginTop: 20,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        // y: 100,
        // x: -100,
        floating: true,
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            distance: -50,
            style: {
              fontWeight: 'bold',
              color: 'white',
            },
          },
          startAngle: -90,
          endAngle: -180,
          center: ['30%', '50%'],
          size: '60%',
          showInLegend: true,
          borderColor: 'transparent'
        },
      },
      series: [
        {
          name: 'Browsers',
          data: [
            {
              name: 'Search Engine <span style="margin-left: 30px">2234</span>',
              y: 60,
              color: '#02BF51'
            },
            {
              name: 'Direct <span style="margin-left: 30px">34</span>',
              y: 11.84,
              color: '#38A4F8'
            },
            {
              name: 'Email <span style="margin-left: 30px">234</span>',
              y: 10.85,
              color: '#0F70F5'
            },
            {
              name: 'Video Ads <span style="margin-left: 30px">24</span>',
              y: 4.67,
              color: '#A300EF'
            },
          ],
          type: 'pie',
          innerSize: 165,
        },
      ],
    }
    // fsdfsdf
    const data = [
      [
        1167609600000,
        0.7537
      ],
      [
        1167696000000,
        0.7537
      ],
      [
        1167782400000,
        0.7559
      ],
      [
        1167868800000,
        0.7631
      ],
      [
        1167955200000,
        0.7644
      ],
      [
        1168214400000,
        0.769
      ],
      [
        1168300800000,
        0.7683
      ],
      [
        1168387200000,
        0.77
      ],
      [
        1168473600000,
        0.7703
      ],
      [
        1168560000000,
        0.7757
      ],
      [
        1168819200000,
        0.7728
      ],
      [
        1168905600000,
        0.7721
      ],
      [
        1168992000000,
        0.7748
      ],
      [
        1169078400000,
        0.774
      ],
      [
        1169164800000,
        0.7718
      ],
      [
        1169424000000,
        0.7731
      ],
      [
        1169510400000,
        0.767
      ],
      [
        1169596800000,
        0.769
      ],
      [
        1169683200000,
        0.7706
      ],
      [
        1169769600000,
        0.7752
      ],
      [
        1170028800000,
        0.774
      ],
      [
        1170115200000,
        0.771
      ],
      [
        1170201600000,
        0.7721
      ],
      [
        1170288000000,
        0.7681
      ],
      [
        1170374400000,
        0.7681
      ],
      [
        1170633600000,
        0.7738
      ],
      [
        1170720000000,
        0.772
      ],
      [
        1170806400000,
        0.7701
      ],
      [
        1170892800000,
        0.7699
      ],
      [
        1170979200000,
        0.7689
      ],
      [
        1171238400000,
        0.7719
      ],
      [
        1171324800000,
        0.768
      ],
      [
        1171411200000,
        0.7645
      ]]
    this.chartOptions2 = {
      chart: {
        zoomType: 'x'
      },
      title: {
        text: '  '
      },
      subtitle: {
        text: document.ontouchstart === undefined ?
          '' : ''
      },
      xAxis: {
        type: 'datetime',
        lineColor: 'gray'
      },
      yAxis: {
        title: {
          text: ''
        },
        gridLineColor: 'var(--bg-gridLine-chart-dash)',
        gridLineDashStyle: 'dash',
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, '#36F097'],
              [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },

      series: [{
        type: 'area',
        name: 'VI to vi',
        data: data,
        color: '#36F097'
      }]
    }
    // let detailChart;
    //
    // // create the detail chart
    // function createDetail(masterChart) {
    //   // prepare the detail chart
    //   const detailData = [],
    //     detailStart = data[0][0];
    //
    //   masterChart.series[0].data.forEach(point => {
    //     if (point.x >= detailStart) {
    //       detailData.push(point.y);
    //     }
    //   });
    //
    //   // create a detail chart referenced by a global variable
    //   detailChart = Highcharts.chart('detail-container','', {
    //     chart: {
    //       marginBottom: 120,
    //       reflow: false,
    //       marginLeft: 50,
    //       marginRight: 20,
    //       style: {
    //         position: 'absolute'
    //       }
    //     },
    //     credits: {
    //       enabled: false
    //     },
    //     title: {
    //       text: 'Historical USD to EUR Exchange Rate',
    //       align: 'left'
    //     },
    //     subtitle: {
    //       text: 'Select an area by dragging across the lower chart',
    //       align: 'left'
    //     },
    //     xAxis: {
    //       type: 'datetime'
    //     },
    //     yAxis: {
    //       title: {
    //         text: null
    //       },
    //       maxZoom: 0.1
    //     },
    //     tooltip: {
    //       formatter: function () {
    //         const point = this.points[0];
    //         return '<b>' + point.series.name + '</b><br/>' + Highcharts.dateFormat('%A %B %e %Y', this.x) + ':<br/>' +
    //           '1 USD = ' + Highcharts.numberFormat(point.y, 2) + ' EUR';
    //       },
    //       shared: true
    //     },
    //     legend: {
    //       enabled: false
    //     },
    //     plotOptions: {
    //
    //       area: {
    //         fillColor: {
    //           linearGradient: {
    //             x1: 0,
    //             y1: 0,
    //             x2: 0,
    //             y2: 1
    //           },
    //           stops: [
    //             [0, '#36F097'],
    //             [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
    //           ]
    //         },
    //         marker: {
    //           radius: 2
    //         },
    //         lineWidth: 1,
    //         states: {
    //           hover: {
    //             lineWidth: 1
    //           }
    //         },
    //         threshold: null
    //       }
    //     },
    //     series: [{
    //       name: 'USD to EUR',
    //       pointStart: data,
    //       pointInterval: 24 * 3600 * 1000,
    //       data: detailData,
    //       color: '#36F097'
    //     }],
    //
    //     exporting: {
    //       enabled: false
    //     }
    //
    //   }); // return chart
    // }
    //
    // // create the master chart
    // function createMaster() {
    //   Highcharts.chart('master-container', {
    //       chart: {
    //         reflow: false,
    //         borderWidth: 0,
    //         backgroundColor: null,
    //         marginLeft: 50,
    //         marginRight: 20,
    //         zoomType: 'x',
    //         events: {
    //
    //           // listen to the selection event on the master chart to update the
    //           // extremes of the detail chart
    //           selection: function (event) {
    //             const extremesObject = event.xAxis[0],
    //               min = extremesObject.min,
    //               max = extremesObject.max,
    //               detailData = [],
    //               xAxis = this.xAxis[0];
    //
    //             // reverse engineer the last part of the data
    //             this.series[0].data.forEach(point => {
    //               if (point.x > min && point.x < max) {
    //                 detailData.push([point.x, point.y]);
    //               }
    //             });
    //
    //             // move the plot bands to reflect the new detail span
    //             xAxis.removePlotBand('mask-before');
    //             xAxis.addPlotBand({
    //               id: 'mask-before',
    //               from: data[0][0],
    //               to: min,
    //               color: 'rgba(0, 0, 0, 0.2)'
    //             });
    //
    //             xAxis.removePlotBand('mask-after');
    //             xAxis.addPlotBand({
    //               id: 'mask-after',
    //               from: max,
    //               to: data[data.length - 1][0],
    //               color: 'rgba(0, 0, 0, 0.2)'
    //             });
    //
    //
    //             detailChart.series[0].setData(detailData);
    //
    //             return false;
    //           }
    //         }
    //       },
    //       title: {
    //         text: null
    //       },
    //       accessibility: {
    //         enabled: false
    //       },
    //       xAxis: {
    //         type: 'datetime',
    //         showLastTickLabel: true,
    //         maxZoom: 14 * 24 * 3600000, // fourteen days
    //         plotBands: [{
    //           id: 'mask-before',
    //           from: data[0][0],
    //           to: data[data.length - 1][0],
    //           color: 'rgba(0, 0, 0, 0.2)'
    //         }],
    //         title: {
    //           text: null
    //         }
    //       },
    //       yAxis: {
    //         gridLineWidth: 0,
    //         labels: {
    //           enabled: false
    //         },
    //         title: {
    //           text: null
    //         },
    //         min: 0.6,
    //         showFirstLabel: false
    //       },
    //       tooltip: {
    //         formatter: function () {
    //           return false;
    //         }
    //       },
    //       legend: {
    //         enabled: false
    //       },
    //       credits: {
    //         enabled: false
    //       },
    //       plotOptions: {
    //         series: {
    //           // fillColor: {
    //           //   linearGradient: [0, 0, 0, 70],
    //           //   stops: [
    //           //     [0, Highcharts.getOptions().colors[0]],
    //           //     [1, 'rgba(255,255,255,0)']
    //           //   ]
    //           // },
    //           lineWidth: 1,
    //           marker: {
    //             enabled: false
    //           },
    //           shadow: false,
    //           states: {
    //             hover: {
    //               lineWidth: 1
    //             }
    //           },
    //           enableMouseTracking: false
    //         }
    //       },
    //
    //       series: [{
    //         type: 'area',
    //         name: 'USD to EUR',
    //         pointInterval: 24 * 3600 * 1000,
    //         pointStart: data[0][0],
    //         data: data
    //       }],
    //
    //       exporting: {
    //         enabled: false
    //       }
    //
    //     },
    //     masterChart => {
    //       createDetail(masterChart);
    //     }); // return chart instance
    // }
    //
    // // make the container smaller and add a second container for the master chart
    // const container = document.getElementById('container');
    // container.style.position = 'relative';
    // container.innerHTML += '<div id="detail-container"></div><div id="master-container"></div>';
    //
    // // create master and in its callback, create the detail chart
    // createMaster();
  }
}

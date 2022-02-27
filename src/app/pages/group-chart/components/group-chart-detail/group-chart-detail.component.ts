import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupChartService} from '../../../../services/group-chart.service';
import {NbDialogService, NbIconConfig, NbToastrService} from '@nebular/theme';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {AuthoritiesConstant} from '../../../../authorities.constant';
import {ConfirmDialogComponent} from '../../../../share/component/confirm-dialog/confirm-dialog.component';
import {ViewLogDialogComponent} from '../../../../share/component/viewlog-dialog/viewlog-dialog.component';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import 'rxjs/add/operator/takeWhile';
import {PopupErrorComponent} from '../../../popup-error/popup-error.component';
import {ShareDataBreadcrumbService} from '../../../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-group-chart-detail',
  templateUrl: './group-chart-detail.component.html',
  styleUrls: ['./group-chart-detail.component.scss']
})
export class GroupChartDetailComponent implements OnInit, OnDestroy {


  @ViewChild('changeListStatus') changeOwnerRef: ElementRef;


  isLoading: boolean = false;
  isFilerBox: boolean = false;
  isJson: boolean = false;
  limits = [5, 10, 15, 20];
  limit = 10;
  authoritiesConstant = AuthoritiesConstant
  results = [];
  rows = [];
  listSmServer = [];
  listTeam = [];
  listChangeFilter = [];
  valueSearch2 = '';
  keyValue = null;
  listFilterForm: FormArray = this.fb.array([]);
  columnsType1 = [
    {name: 'STT', prop: 'stt', flexGrow: 0.5},
    {name: 'Status', prop: 'status', flexGrow: 1},
    {name: 'Alert Type', prop: 'alertType', flexGrow: 1},
    {name: 'Owner', prop: 'owner', flexGrow: 1},
    {name: 'DateTime', prop: 'dateTime', flexGrow: 1.5},
    {name: 'Description', prop: 'description', flexGrow: 3},
    {name: 'Action', prop: 'action_btn', flexGrow: 1},
  ];
  columnsType2 = [
    {name: 'STT', prop: 'stt', colWidth: 50, minWidth: 50, background: 'red'},
    {name: 'Name App', prop: 'name', colWidth: 120, minWidth: 0, background: 'blue'},
    {name: 'Type App', prop: 'type', colWidth: 120, minWidth: 0, background: 'orange'},
    {name: 'Server', prop: 'host', colWidth: 120, minWidth: 0, background: 'purple'},
    {name: 'Port', prop: 'port', colWidth: 100, minWidth: 0, background: 'purple'},
    {name: 'Owner', prop: 'owner', colWidth: 120, minWidth: 0, background: 'green'},
    {name: 'Team', prop: 'teamName', colWidth: 120, minWidth: 0},
    {name: 'Directory', prop: 'directory', colWidth: 220, minWidth: 0, background: 'green'},
    {name: 'Status', prop: 'status', colWidth: 120, minWidth: 0, background: 'yellow'},
    {name: 'Action', prop: 'action_btn', colWidth: 200, minWidth: 0, background: 'black'},
  ];
  columnsType3 = [
    {name: 'STT', prop: 'stt', flexGrow: 0.5},
    {name: 'Status', prop: 'status', flexGrow: 1},
    {name: 'Job Name', prop: 'jobName', flexGrow: 1.5},
    {name: 'Job Relation', prop: 'jobRel', flexGrow: 1.5},
    {name: 'Owner', prop: 'owner', flexGrow: 1},
    {name: 'Slave Running', prop: 'slaveRunning', flexGrow: 1},
    {name: 'Start Time', prop: 'startTime', flexGrow: 1},
    {name: 'Update Time', prop: 'updateTime', flexGrow: 1},
    {name: 'Action', prop: 'action_btn', flexGrow: 1},
  ];
  listStatusType1 = [
    {label: 'Processed', value: 0},
    {label: 'No Processed', value: 1},
    {label: 'Checking', value: 2}
  ];
  listStatusType2 = [
    {label: 'Running', value: 0},
    {label: 'Stop', value: 1},
    {label: 'TimeOut', value: 2}
  ];
  listStatusEdit = [
    {name: 'Running', value: 0},
    {name: 'Stopped', value: 1},
    {name: 'No connection', value: 2},
  ];
  listStatusType3 = [
    {label: 'Error', value: 0},
    {label: 'Running', value: 1},
    {label: 'Waiting', value: 2},
    {label: 'Time Out', value: 3}
  ];
  listTypeApp = [
    {name: 'Node Manager', value: 'nodemanager'},
    {name: 'Thrift server', value: 'thriftserver'},
    {name: 'Spark server', value: 'sparkserver'},
    {name: 'Zeppelin', value: 'zeppelin'},
    {name: 'Service', value: 'service'},
    {name: 'Data node', value: 'datanode'},
    {name: 'Streaming', value: 'streaming'},
    {name: 'Wrapper', value: 'wrapper'},
    {name: 'Streaming CPM', value: 'streamingcmp'}
  ]
  listFilter = [
    {name: 'Type app', value: '01'},
    {name: 'Server', value: '02'},
    {name: 'Team', value: '03'},
  ]
  optionDefault;
  filter = {
    status: null,
    chartCode: null,
    textSearch: '',
    startTime: null,
    endTime: null
  };
  typeOfViewDetail;
  titleName;
  addForm = this.fb.group({
    typeApp: [null, [Validators.required, Validators.maxLength(200)]],
    nameApp: [null, [Validators.required, Validators.maxLength(200)]],
    status: [1],
    owner: [null, [Validators.required, Validators.maxLength(200)]],
    config: [null],
    description: [null],
    activated: [1],
    rm_ui: [null],
    teamId: [null, [Validators.required]],
    directory: [null, [Validators.required]],
    port: [null, [Validators.required]],
    host: [null, [Validators.required]],
    startedBy: [null, [Validators.required]],
    executeFile: [null],
    viewLog: [null]
  });
  mask = {
    guide: true,
    showMask: false,
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
  };
  private alive: boolean; // used to unsubscribe from the TimerObservable
                          // when OnDestroy is called.
  private interval: number;
  public processInterval: any;

  constructor(private routess: Router, private activatedRoute: ActivatedRoute, private groupChartService: GroupChartService, public dialogService: NbDialogService, private fb: FormBuilder, private toastrService: NbToastrService, private datePipe: DatePipe, private shareData: ShareDataBreadcrumbService) {
    this.alive = true;
    this.interval = 30000;
    console.log(this.routess.getCurrentNavigation().extras.state)
    this.titleName = this.routess.getCurrentNavigation().extras.state.title
  }

  ngOnInit(): void {
    // this.sendDataBreadcrumb();
    this.addRowFilter();
    this.smServerInfo();
    this.getListWpGroup();
    this.isLoading = true;
    this.activatedRoute.data.subscribe(data => {
      console.log(data)
      if (data) {
        this.isLoading = false;
        this.rows = data.data.results;
        // this.results = [...this.rows];
        this.filter.chartCode = data.data.chartCode;
        this.typeOfViewDetail = data.data.typeOfViewDetail;
      }
    }, error => {
      this.isLoading = false;
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.message},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
    })
    this.processInterval = TimerObservable.create(0, this.interval)
      .takeWhile(() => true)
      .subscribe(() => {
        this.search();
        // console.log('olooooo')
      });
    this.optionDefault = {
      keySearch: '',
      keyType: '',
      keyServer: '',
      keyTeam: ''
    };
  }

  sendDataBreadcrumb() {
    this.shareData.updateData({
      title: 'System information',
      titleChild: 'Group chart details',
      groupText: 'App monitor',
      urlParent: '/page/group-chart',
      urlPage: '/page/group-chart/group-chart-detail'
    })
  }

  ngOnDestroy() {
    this.processInterval.unsubscribe();
  }

  smServerInfo() {
    this.groupChartService.smServerInfo().subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.listSmServer = res.body.results;
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
    })
  }

  getListWpGroup() {
    this.groupChartService.getListWpGroup().subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.listTeam = res.body.results;
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
    })
  }

  addRowFilter() {
    if (this.listFilterForm.value.length <= 3) {
      this.listFilterForm.push(this.fb.group({
        typeFilter: [null, Validators.required],
        keyFilter: ['', Validators.required],
      }));
      // this.lists.push([]);
    }
    this.listChangeFilter = [];
  }

  deleteRowFilter(row: any) {
    const index = this.listFilterForm.value.findIndex(e => e.selectedFilter === row.value.selectedFilter);
    this.listFilterForm.removeAt(index);
    // this.lists.splice(index, 1);
  }

  formatDate(date) {
    const result = new Date(date);
    return result.getDate() + '-' + (result.getMonth() + 1) + '-' + result.getFullYear();
  }

  search() {
    const startTime = this.filter.startTime ? this.formatDate(this.filter.startTime) : this.filter.startTime;
    const endTime = this.filter.endTime ? this.formatDate(this.filter.endTime) : this.filter.endTime;
    if (this.typeOfViewDetail === 2) {
      this.isLoading = true;
      this.dosSearchCm(this.optionDefault);
    } else if (this.typeOfViewDetail === 3) {
      this.isLoading = true;
      this.groupChartService.searchForJob({
        ...this.filter,
        textSearch: this.filter.textSearch.trim(),
        startTime,
        endTime,
      }).subscribe(res => {
          if (res.body.responseType === 'SUCCESS') {
            this.isLoading = false;
            this.results = res.body.results;
          } else {
            this.isLoading = false;
            this.dialogService.open(PopupErrorComponent, {
              context: {error: res.body.message},
              closeOnEsc: false,
              closeOnBackdropClick: false
            })
          }
        }, error => {
          this.isLoading = false;
          this.dialogService.open(PopupErrorComponent, {
            context: {error: error.error.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
        }
      )
    } else {
      this.isLoading = true;
      this.groupChartService.searchForErrorsList({
        ...this.filter,
        alertCode: this.filter.chartCode,
        chartCode: null,
        textSearch: this.filter.textSearch.trim(),
        startTime,
        endTime,
      }).subscribe(res => {
          if (res.body.responseType === 'SUCCESS') {
            this.isLoading = false;
            this.results = res.body.results;
          } else {
            this.isLoading = false;
            this.dialogService.open(PopupErrorComponent, {
              context: {error: res.body.message},
              closeOnEsc: false,
              closeOnBackdropClick: false
            })
          }
        }, error => {
          this.isLoading = false;
          this.dialogService.open(PopupErrorComponent, {
            context: {error: error.error.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
        }
      )
    }
  }

  dosSearchCm(options) {
    this.groupChartService.dosSearchCm(options).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.isLoading = false;
        this.results = res.body.results;
      } else {
        this.isLoading = false;
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    }, error => {
      this.isLoading = false;
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.message},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
    })
  }

  openAddOrEditDialog(ref, data = null, key: string) {
    this.isJson = false;
    if (data) {
      this.addForm.patchValue({
        nameApp: data?.name,
        host: data?.host,
        port: data?.port,
        description: data?.description,
        directory: data?.directory,
        owner: data?.owner,
        teamId: data?.teamId,
        typeApp: data?.type,
        config: data?.config,
        activated: data?.activated,
        status: data?.status,
        executeFile: data?.executeFile,
        viewLog: data?.viewLog,
        startedBy: data?.startedBy
      });
    } else {
      this.addForm.patchValue({
        config: '{ }'
      })
    }
    this.dialogService.open(ref, {
      context: {appId: data ? data.appId : null, title: key, id: data.id},
      closeOnBackdropClick: false
    }).onClose.subscribe(value => {
      this.addForm.reset();
    })
  }

  addJobForProcess(ref, appId) {
    if (!appId) {
      this.isLoading = true;
      const options = {
        name: this.addForm.value.nameApp,
        host: this.addForm.value.host,
        port: this.addForm.value.port,
        description: this.addForm.value.description,
        directory: this.addForm.value.directory,
        startedBy: this.addForm.value.startedBy,
        owner: this.addForm.value.owner,
        teamId: this.addForm.value.teamId,
        type: this.addForm.value.typeApp,
        config: this.addForm.value.config,
        activated: 1,
        status: 1,
        chartCode: this.filter.chartCode,
        executeFile: this.addForm.value.executeFile,
        viewLog: this.addForm.value.viewLog
      }
      this.groupChartService.addCm(options).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          this.isLoading = false;
          this.toastrService.success('Add new successfully', 'Notification');
          ref.close();
          this.search();
        } else {
          this.isLoading = false;
          this.toastrService.danger(res.body.message, 'Thông báo');
          ref.close();
        }
      }, error => {
        this.isLoading = false;
        if (error.error?.errorKey === '01') {
          this.toastrService.danger(error.error?.message, 'Thông báo');
        } else {
          this.toastrService.danger('Fail', 'Thông báo');
        }
      })
    } else {
      this.isLoading = true;
      const optionEdits = {
        id: appId,
        name: this.addForm.value.nameApp,
        host: this.addForm.value.host,
        port: this.addForm.value.port,
        description: this.addForm.value.description,
        directory: this.addForm.value.directory,
        startedBy: this.addForm.value.startedBy,
        owner: this.addForm.value.owner,
        teamId: this.addForm.value.teamId,
        type: this.addForm.value.typeApp,
        config: this.addForm.value.config,
        activated: this.addForm.value.activated,
        status: 1,
        chartCode: this.filter.chartCode,
        executeFile: this.addForm.value.executeFile,
        viewLog: this.addForm.value.viewLog
      }
      this.groupChartService.updateCm(optionEdits).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          this.isLoading = false;
          this.toastrService.success('Update successfully', 'Notification');
          ref.close();
          this.search();
        } else {
          this.isLoading = false;
          this.toastrService.danger(res.body.message, 'Thông báo');
          ref.close();
        }
      }, error => {
        this.isLoading = false;
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error.error.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      })
    }
  }

  deleteJobForProcess(ref, appId) {
    this.groupChartService.deleteJobForProcess(appId).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success('Delete successfully', 'Notification');
        ref.close();
        this.search();
      } else {
        const iconConfig: NbIconConfig = {icon: 'alert-circle-outline', pack: 'eva'};
        this.toastrService.danger(res.body.message, 'Notification', iconConfig);
      }
    }, error => {
      const iconConfig: NbIconConfig = {icon: 'alert-circle-outline', pack: 'eva'};
      this.toastrService.danger(error.body.message, 'Notification', iconConfig);
    })
  }

  copyText(value: any) {
    this.toastrService.success('Copied', 'Notification');
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '1';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  handleChangeStartTime(event) {
    this.filter.startTime = event.target.value;
  }

  handleChangeEndTime(event) {
    this.filter.endTime = event.target.value;
  }

  startApp(row) {
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      autoFocus: true,
      closeOnBackdropClick: false,
      context: {
        message: `Bạn có chắc chắn muốn khởi chạy ứng dụng '${row.name}' không?`
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.groupChartService.startApp(row.id).subscribe(
          (ress) => {
            row.status = 0;
            if (ress.body.responseType === 'SUCCESS') {
              this.toastrService.success('Khởi chạy thành công', 'Thông báo', {icon: 'checkmark-outline'});
              this.search();
              ref.close();
            } else {
              this.toastrService.danger(ress.body.message, ('note'));
              ref.close();
            }
          },
          (error) => {
            this.toastrService.danger(error.error.message, 'Lỗi', {icon: 'alert-triangle-outline'});
          }
        );
      }
    });
  }

  stopApp(row) {
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      autoFocus: true,
      closeOnBackdropClick: false,
      context: {
        message: `Bạn có chắc chắn muốn dừng ứng dụng '${row.name}' không?`
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.groupChartService.stopApp(row.id).subscribe(
          (ress) => {
            row.status = 1;
            if (ress.body.responseType === 'SUCCESS') {
              this.toastrService.success('Stop ứng dụng thành công', 'Thông báo', {icon: 'checkmark-outline'});
              this.search();
              ref.close();
            } else {
              this.toastrService.danger(ress.body.message, ('note'));
              ref.close();
            }
          },
          (error) => {
            this.toastrService.danger(error.error.message, 'Lỗi', {icon: 'alert-triangle-outline'});
          }
        );
      }
    });
  }

  restart(row) {
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      autoFocus: true,
      closeOnBackdropClick: false,
      context: {
        message: `Bạn có chắc chắn muốn khởi động lại ứng dụng '${row.name}' không?`
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.groupChartService.restart(row.id).subscribe(
          (result) => {
            if (result.body.responseType === 'SUCCESS') {
              this.toastrService.success('Restart ứng dụng thành công', 'Thông báo', {icon: 'checkmark-outline'});
              this.search();
              ref.close();
            } else {
              this.toastrService.danger(result.body.message, ('note'));
              ref.close();
            }
          },
          (error) => {
            this.toastrService.danger(error.error.message, 'Lỗi', {icon: 'alert-triangle-outline'});
          }
        );
      }
    });
  }

  openViewLogDialog(data) {
    const ref = this.dialogService.open(ViewLogDialogComponent, {
      autoFocus: true,
      closeOnBackdropClick: false,
      context: {
        data: data?.id
      },
    });
    // this.groupChartService.viewLogApp(data.appId).subscribe(res => {
    //   if (res.body.responseType === 'SUCCESS') {
    //     // this.results = res.body.results;
    //     // console.log(res.body.results);
    //     const ref = this.dialogService.open(ViewLogDialogComponent, {
    //       autoFocus: true,
    //       closeOnBackdropClick: true,
    //       context: {
    //         data: res.body.results
    //       },
    //     });
    //     this.toastrService.success('View log successfully', 'Notification');
    //   } else {
    //     const iconConfig: NbIconConfig = {icon: 'alert-circle-outline', pack: 'eva'};
    //     this.toastrService.danger(res.body.message, 'Notification', iconConfig);
    //   }
    // }, error => {
    //   const iconConfig: NbIconConfig = {icon: 'alert-circle-outline', pack: 'eva'};
    //   this.toastrService.danger(error.body.message, 'Notification', iconConfig);
    // })
  }


  fitlerWithValue(rowItem: any) {
    if (this.keyValue !== null || this.valueSearch2 !== '') {
      if (this.keyValue === null) {
        this.results = rowItem.filter(v => v.typeApp?.toLowerCase().includes(this.valueSearch2 || '')
          || v.nameApp?.toLowerCase().includes(this.valueSearch2 || '')
          || v.owner?.toLowerCase().includes(this.valueSearch2 || '')
          || v.ipSetup?.toLowerCase().includes(this.valueSearch2 || '')
          || v.dirSetup?.toLowerCase().includes(this.valueSearch2 || ''));
      } else {
        this.results = rowItem.filter(v => v.status === this.keyValue && (v.typeApp?.toLowerCase().includes(this.valueSearch2 || '')
          || v.nameApp?.toLowerCase().includes(this.valueSearch2 || '')
          || v.owner?.toLowerCase().includes(this.valueSearch2 || '')
          || v.ipSetup?.toLowerCase().includes(this.valueSearch2 || '')
          || v.dirSetup?.toLowerCase().includes(this.valueSearch2 || '')));
      }
    } else {
      this.results = [...rowItem];
    }
  }

  openBoxFiler() {
    this.isFilerBox = !this.isFilerBox;
  }

  searchTable() {
    if (this.valueSearch2 !== '') {
      this.results = this.rows.filter(v => v.typeApp.toLowerCase().indexOf(this.valueSearch2.toLowerCase()) !== -1
        || v.nameApp.toLowerCase().indexOf(this.valueSearch2.toLowerCase()) !== -1
        || v.owner.toLowerCase().indexOf(this.valueSearch2.toLowerCase()) !== -1
        || v.ipSetup.toLowerCase().indexOf(this.valueSearch2.toLowerCase()) !== -1
        || v.dirSetup.toLowerCase().indexOf(this.valueSearch2.toLowerCase()) !== -1
      )
    } else {
      this.results = [...this.rows];
    }
  }

  isJsonString() {
    try {
      JSON.parse(this.addForm.value.config);
      this.isJson = false;
    } catch (e) {
      this.isJson = true;
    }
  }

  filterChange(row, index: number) {
    const arrayResole = [];
    if (row.value.selectedFilter === null) {
      this.listChangeFilter[index] = [];
      this.listFilterForm.at(index).patchValue({
        typeFilter: null,
      });
    } else {
      if (row.value.typeFilter === '01') {
        this.listChangeFilter[index] = this.listTypeApp;
        this.listFilterForm.at(index).patchValue({
          keyFilter: null,
        });
      } else if (row.value.typeFilter === '02') {
        this.listSmServer.map((values) => {
          arrayResole.push({name: values?.ip, value: values?.ip})
        })
        this.listChangeFilter[index] = arrayResole;
        this.listFilterForm.at(index).patchValue({
          keyFilter: null,
        });
      } else {
        this.listTeam.map((values) => {
          arrayResole.push({name: values?.name, value: values?.name})
        })
        this.listChangeFilter[index] = arrayResole;
        this.listFilterForm.at(index).patchValue({
          keyFilter: null,
        });
      }
    }
  }

  filterWithValue() {
    this.optionDefault = {
      keySearch: this.valueSearch2,
      typeFilter: this.listFilterForm.value[0]?.typeFilter,
      keyFilter: this.listFilterForm.value[0]?.keyFilter,
      chartCode: this.filter.chartCode
    };
    this.dosSearchCm(this.optionDefault);
  }

  closePupupFilter() {
    this.isFilerBox = false;
    this.listFilterForm = this.fb.array([]);
    this.listFilterForm.push(this.fb.group({
      typeFilter: [null, Validators.required],
      keyFilter: ['', Validators.required],
    }));
    this.listChangeFilter = [];
    this.optionDefault = {
      keySearch: '',
      keyType: '',
      keyServer: '',
      keyTeam: ''
    };
    this.dosSearchCm(this.optionDefault);
  }

  portValidate(e) {
    return !isNaN(e.key) || e.key === 'Backspace' || e.key === ','
  }
}

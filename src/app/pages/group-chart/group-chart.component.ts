import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NbDialogService, NbIconConfig, NbToastrService} from '@nebular/theme';
import {GroupChartService} from '../../services/group-chart.service';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthoritiesConstant} from '../../authorities.constant';
import {PopupErrorComponent} from '../popup-error/popup-error.component';
import {AccountService} from '../../@core/auth/account.service';
import {ViewLogDialogComponent} from '../../share/component/viewlog-dialog/viewlog-dialog.component';
import {ConfirmDialogComponent} from '../../share/component/confirm-dialog/confirm-dialog.component';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-group-chart',
  templateUrl: './group-chart.component.html',
  styleUrls: ['./group-chart.component.scss']
})
export class GroupChartComponent implements OnInit {
  @ViewChild('addOrEdit') addOrEdit: TemplateRef<any>;
  authoritiesConstant = AuthoritiesConstant;
  checkerrorServer: boolean = false;
  iscardDetails: boolean = false;
  isChartCard: boolean = true;
  typeOfViewDetails;
  results = [];
  resultsDataDetails = [];
  rowDataFilter = [];
  row = [];
  isLoading: boolean = false;
  listGroupName = [];
  valueText = '';
  filter = {
    status: null,
    chartCode: null,
    textSearch: '',
    startTime: null,
    endTime: null
  };
  listChartForCombobox = [];
  chartForm = this.fb.group({
    groupName: [null, [Validators.required]],
    chartType: [null, [Validators.required]],
    title: [null, [Validators.required, Validators.maxLength(50)]],
    timeUpdate: [null, [Validators.required]]
  });
  addForm = this.fb.group({
    typeApp: [null, [Validators.required, Validators.maxLength(200)]],
    nameApp: [null, [Validators.required, Validators.maxLength(200)]],
    status: [null],
    ipSetup: [null, [Validators.required, Validators.maxLength(200)]],
    owner: [null, [Validators.required, Validators.maxLength(200)]],
    dirSetup: [null, [Validators.required, Validators.maxLength(200)]]
  });
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
    {name: 'STT', prop: 'stt', colWidth: 40, minWidth: 40, background: 'red'},
    {name: 'Status', prop: 'status', colWidth: 50, minWidth: 50, background: 'yellow'},
    {name: 'Type App', prop: 'typeApp', colWidth: 150, minWidth: 50, background: 'orange'},
    {name: 'Name App', prop: 'nameApp', colWidth: 250, minWidth: 50, background: 'blue'},
    {name: 'Owner', prop: 'owner', colWidth: 250, minWidth: 50, background: 'green'},
    {name: 'IP Setup', prop: 'ipSetup', colWidth: 100, minWidth: 50, background: 'purple'},
    {name: 'Dir Setup', prop: 'dirSetup', colWidth: 350, minWidth: 50, background: 'green'},
    {name: 'Action', prop: 'action_btn', colWidth: 100, minWidth: 100, background: 'black'},
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
  dataItem: {
    title: 'System information',
    titleChild: 'App monitor',
    urlPage: '/webportal/group-chart'
  }

  constructor(public dialogService: NbDialogService, private groupChartService: GroupChartService, private shareData: ShareDataBreadcrumbService, private fb: FormBuilder, private toastrService: NbToastrService, private accountService: AccountService) {
  }

  ngOnInit(): void {
    // this.sendDataTest();
    this.search();
    this.loadListGroupName();
    this.chartForm.get('groupName').valueChanges.subscribe(value => {
      this.chartForm.get('chartType').reset();
      if (value) {
        this.loadChartByGroupName(value);
      } else {
        this.listChartForCombobox = [];
      }
    });
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
      title: 'System information',
      titleChild: 'App monitor',
      urlPage: '/page/group-chart'
    })
  }

  search(groupName = '') {
    this.isLoading = true;
    this.iscardDetails = false;
    this.isChartCard = true;
    this.valueText = '';
    this.groupChartService.getAll({groupName: groupName}).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.isLoading = false;
        this.row = res.body.results;
        this.results = [...this.row];
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

  formatDate(date) {
    const result = new Date(date);
    return result.getDate() + '-' + (result.getMonth() + 1) + '-' + result.getFullYear();
  }

  searchRowDataChartCard() {
    const startTime = this.filter.startTime ? this.formatDate(this.filter.startTime) : this.filter.startTime;
    const endTime = this.filter.endTime ? this.formatDate(this.filter.endTime) : this.filter.endTime;
    if (this.typeOfViewDetails === 2) {
      this.isLoading = true;
      this.groupChartService.findJobForProcess({
        ...this.filter,
        textSearch: this.filter.textSearch.trim(),
        startTime,
        endTime,
      }).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          this.isLoading = false;
          this.resultsDataDetails = res.body.results;
          console.log(this.resultsDataDetails)
          // this.results = [...this.rows];
          // this.fitlerWithValue(this.rows);
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
    } else if (this.typeOfViewDetails === 3) {
      this.isLoading = true;
      this.groupChartService.searchForJob({
        ...this.filter,
        textSearch: this.filter.textSearch.trim(),
        startTime,
        endTime,
      }).subscribe(res => {
          if (res.body.responseType === 'SUCCESS') {
            this.isLoading = false;
            this.resultsDataDetails = res.body.results;
            console.log(this.resultsDataDetails)
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
            this.resultsDataDetails = res.body.results;
            console.log(this.resultsDataDetails)
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

  searchChartCardDetails() {
    if (this.valueText !== '') {
      this.rowDataFilter = [...this.row].filter(v => v?.title.toLowerCase().indexOf(this.valueText) !== -1)
      this.results = this.rowDataFilter;
      this.iscardDetails = false;
      this.isChartCard = true;
      // if (this.rowDataFilter.length !== 0) {
      //   this.iscardDetails = true;
      //   this.isChartCard = false;
      //   this.typeOfViewDetails = this.rowDataFilter[0]?.typeOfViewDetail;
      //   this.filter.chartCode = this.rowDataFilter[0]?.chartCode;
      //   this.searchRowDataChartCard();
      // } else {
      //   this.iscardDetails = false;
      //   this.isChartCard = true;
      //   this.resultsDataDetails = [];
      //   this.results = [];
      // }
    } else {
      this.iscardDetails = false;
      this.isChartCard = true;
      this.results = [...this.row]
    }
  }

  openViewLogDialog(data) {
    this.groupChartService.viewLogApp(data.appId).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        // this.results = res.body.results;
        // console.log(res.body.results);
        const ref = this.dialogService.open(ViewLogDialogComponent, {
          autoFocus: true,
          closeOnBackdropClick: true,
          context: {
            data: res.body.results
          },
        });
        this.toastrService.success('View log successfully', 'Notification');
      } else {
        const iconConfig: NbIconConfig = {icon: 'alert-circle-outline', pack: 'eva'};
        this.toastrService.danger(res.body.message, 'Notification', iconConfig);
      }
    }, error => {
      const iconConfig: NbIconConfig = {icon: 'alert-circle-outline', pack: 'eva'};
      this.toastrService.danger(error.body.message, 'Notification', iconConfig);
    })
  }

  startApp(row) {
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      autoFocus: true,
      closeOnBackdropClick: false,
      context: {
        message: `Bạn có chắc chắn muốn khởi chạy ứng dụng '${row.nameApp}' không?`
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.groupChartService.startApp(row.appId).subscribe(
          () => {
            row.status = 0
            this.toastrService.success('Khởi chạy thành công', 'Thông báo', {icon: 'checkmark-outline'});
          },
          (error) => {
            this.toastrService.danger(error.error.title, 'Lỗi', {icon: 'alert-triangle-outline'});
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
        message: `Bạn có chắc chắn muốn dừng ứng dụng '${row.nameApp}' không?`
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.groupChartService.stopApp(row.appId).subscribe(
          () => {
            row.status = 1
            this.toastrService.success('Stop ứng dụng thành công', 'Thông báo', {icon: 'checkmark-outline'});
          },
          (error) => {
            this.toastrService.danger(error.error.title, 'Lỗi', {icon: 'alert-triangle-outline'});
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
        message: `Bạn có chắc chắn muốn khởi động lại ứng dụng '${row.nameApp}' không?`
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.groupChartService.restart(row.appId).subscribe(
          (result) => {
            if (result.body.responseType === 'SUCCESS') {
              this.toastrService.success('Restart ứng dụng thành công', 'Thông báo', {icon: 'checkmark-outline'});
              ref.close();
            } else {
              this.toastrService.danger(result.body.message, ('note'));
              ref.close();
            }
          },
          (error) => {
            this.toastrService.danger(error.error.title, 'Lỗi', {icon: 'alert-triangle-outline'});
          }
        );
      }
    });
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

  openAddOrEditDialog(ref, data = null) {
    if (data) {
      this.addForm.patchValue({
        typeApp: data.typeApp,
        nameApp: data.nameApp,
        ipSetup: data.ipSetup,
        status: data.status,
        owner: data.owner,
        dirSetup: data.dirSetup
      });
    }
    this.dialogService.open(ref, {context: {appId: data ? data.appId : null}}).onClose.subscribe(value => {
      this.addForm.reset();
    })
  }

  addJobForProcess(ref, appId) {
    if (!appId) {
      this.isLoading = true;
      this.groupChartService.addJobForProcess({
        ...this.addForm.value,
        chartCode: this.filter.chartCode,
        status: 1
      }).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          this.isLoading = false;
          this.toastrService.success('Add new successfully', 'Notification');
          ref.close();
          this.searchRowDataChartCard();
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
    } else {
      this.isLoading = true;
      this.groupChartService.updateJobForProcess({
        ...this.addForm.value,
        chartCode: this.filter.chartCode
      }, appId).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          this.isLoading = false;
          this.toastrService.success('Update successfully', 'Notification');
          ref.close();
          this.searchRowDataChartCard();
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
  }

  loadChartByGroupName(groupName: string) {
    this.groupChartService.getChartByGroupName({groupName: groupName}).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        const array: number[] = res.body.results;
        array.filter(a => {
          if (a === 3) {
            array.splice(array.indexOf(3), 1);
            array.push(1)
          }
          ;
          if (a === 4) {
            array.splice(array.indexOf(4), 1);
            array.push(2)
          }
        })
        this.listChartForCombobox = Array.from(new Set(array));
      }
    })
  }

  loadListGroupName() {
    this.isLoading = true;
    this.groupChartService.getListGroupName({}).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.listGroupName = res.body.results;
        this.isLoading = false;
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

  handleEditChart(event) {
    const target = this.results.find(r => r.chartCode === event);
    this.chartForm.patchValue({
      groupName: target.groupName,
      chartType: target.chartType,
      title: target.title,
      timeUpdate: target.timeUpdate.toString()
    });
    this.dialogService.open(this.addOrEdit, {context: {title: 'Edit chart', id: event}}).onClose.subscribe(value => {
      this.chartForm.reset();
    });
  }

  handleAddChart() {
    this.dialogService.open(this.addOrEdit, {
      context: {title: 'Add chart'},
      closeOnBackdropClick: false
    }).onClose.subscribe(value => {
      this.chartForm.reset();
    });
  }

  handleGetTitle(event) {
    console.log(event);
  }

  save(ref, id) {
    if (!id) {
      this.isLoading = true;
      this.groupChartService.addGroupChart({
        ...this.chartForm.value,
        timeUpdate: +this.chartForm.value.timeUpdate
      }).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          this.toastrService.success('Add new successfully', 'Notification');
          ref.close();
          this.search();
          this.isLoading = false;
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
    } else {
      this.isLoading = true;
      this.groupChartService.updateGroupChart({
        ...this.chartForm.value,
        timeUpdate: +this.chartForm.value.timeUpdate
      }, id).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          this.toastrService.success('Update successfully', 'Notification');
          ref.close();
          this.search();
          this.isLoading = false;
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

  }

  handleDeleteChart(ref, id) {
    this.isLoading = true;
    this.groupChartService.deleteGroupChart(id).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success('Delete successfully', 'Notification');
        ref.close();
        this.search();
        this.isLoading = false;
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

  validateNumber(event: any) {
    if (event.target.value > 999999999999999 || event.key === '-' || event.key === '.' || event.key === 'E' || event.key === '+' || event.key === 'e') {
      event.preventDefault();
    }
  }


  // custom with dashboard user
  DeleteDashboardCard() {

  }

  OpenEditForm() {

  }
}


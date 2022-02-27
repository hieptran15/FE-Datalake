import {Component, OnInit} from '@angular/core';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {PopupErrorComponent} from '../popup-error/popup-error.component';
import {GroupChartService} from '../../services/group-chart.service';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {ConfirmDialogComponent} from '../../share/component/confirm-dialog/confirm-dialog.component';
import {ViewLogDialogComponent} from '../../share/component/viewlog-dialog/viewlog-dialog.component';

@Component({
  selector: 'ngx-application-management',
  templateUrl: './application-management.component.html',
  styleUrls: ['./application-management.component.scss']
})
export class ApplicationManagementComponent implements OnInit {
  isLoading: boolean = false;
  isFilerBox: boolean = false;
  isJson: boolean = false;
  limits = [5, 10, 15, 20];
  limit = 10;
  valueSearch2 = '';
  optionDefault;
  results = [];
  listSmServer = [];
  listTeam = [];
  listChangeFilter = [];
  listServerUser = [];
  listFilterSelected = [];
  arrayFilter = [];
  listFilterForm: FormArray = this.fb.array([]);
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
    serverUserId: [null, [Validators.required]],
    executeFile: [null],
    viewLog: [null]
  });
  columnsType2 = [
    {name: 'STT', prop: 'stt', colWidth: 50, minWidth: 50, background: 'red'},
    {name: 'Name App', prop: 'name', colWidth: 180, minWidth: 0, background: 'blue'},
    {name: 'Type App', prop: 'type', colWidth: 100, minWidth: 0, background: 'orange'},
    {name: 'Server', prop: 'host', colWidth: 120, minWidth: 0, background: 'purple'},
    {name: 'Port', prop: 'port', colWidth: 100, minWidth: 0, background: 'purple'},
    {name: 'Owner', prop: 'owner', colWidth: 100, minWidth: 0, background: 'green'},
    {name: 'Team', prop: 'teamName', colWidth: 120, minWidth: 0},
    {name: 'Directory', prop: 'directory', colWidth: 220, minWidth: 0, background: 'green'},
    {name: 'Status', prop: 'status', colWidth: 120, minWidth: 0, background: 'yellow'},
    {name: 'Action', prop: 'action_btn', colWidth: 200, minWidth: 0, background: 'black'},
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
    {name: 'Type app', value: 'keyType'},
    {name: 'Server', value: 'keyServer'},
    {name: 'Team', value: 'keyTeam'},
  ]
  listStatusEdit = [
    {name: 'Running', value: 0},
    {name: 'Stopped', value: 1},
    {name: 'No connection', value: 2},
  ];
  optionChange = {
    keySearch: this.valueSearch2,
    keyType: '',
    keyServer: '',
    keyTeam: ''
  }

  constructor(private shareData: ShareDataBreadcrumbService, private fb: FormBuilder, private groupChartService: GroupChartService, public dialogService: NbDialogService, private toastrService: NbToastrService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.optionDefault = {
      keySearch: '',
      keyType: '',
      keyServer: '',
      keyTeam: ''
    };
    this.dosSearchsCm(this.optionDefault);
    this.sendDataBreadcrumb();
    this.addRowFilter();
    this.smServerInfo();
    this.getListWpGroup();
  }

  sendDataBreadcrumb() {
    this.shareData.updateData({
      title: 'Utility',
      titleChild: 'Process Manager',
      urlPage: '/page/application-management'
    })
  }

  dosSearchsCm(options) {
    this.isLoading = true;
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
    this.isFilerBox = false;
    if (data) {
      const serverId = this.listSmServer.filter(v => v.ip === data?.host)[0]?.id;
      this.groupChartService.getServerUser({serverId: serverId}).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          this.listServerUser = res.body.results;
        } else {
          this.toastrService.danger(res.body.message, ('note'));
        }
      }, (error) => {
        this.toastrService.danger(error.error.message, 'Lỗi', {icon: 'alert-triangle-outline'});
      })
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
        serverUserId: data?.serverUserId
      });
    } else {
      this.listServerUser = [];
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
        serverUserId: this.addForm.value.serverUserId,
        owner: this.addForm.value.owner,
        teamId: this.addForm.value.teamId,
        type: this.addForm.value.typeApp,
        config: this.addForm.value.config,
        activated: 1,
        status: 1,
        executeFile: this.addForm.value.executeFile,
        viewLog: this.addForm.value.viewLog
      }
      this.groupChartService.addCm(options).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          this.isLoading = false;
          this.toastrService.success('Add new successfully', 'Notification');
          ref.close();
          this.dosSearchsCm(this.optionDefault);
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
        serverUserId: this.addForm.value.serverUserId,
        owner: this.addForm.value.owner,
        teamId: this.addForm.value.teamId,
        type: this.addForm.value.typeApp,
        config: this.addForm.value.config,
        activated: this.addForm.value.activated,
        status: 1,
        executeFile: this.addForm.value.executeFile,
        viewLog: this.addForm.value.viewLog
      }
      this.groupChartService.updateCm(optionEdits).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          this.isLoading = false;
          this.toastrService.success('Update successfully', 'Notification');
          ref.close();
          this.dosSearchsCm(this.optionDefault);
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
              this.dosSearchsCm(this.optionDefault);
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
              this.dosSearchsCm(this.optionDefault);
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
              this.dosSearchsCm(this.optionDefault);
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
    this.dialogService.open(ViewLogDialogComponent, {
      autoFocus: true,
      closeOnBackdropClick: false,
      context: {
        data: data?.id
      },
    });
  }

  isJsonString() {
    try {
      JSON.parse(this.addForm.value.config);
      this.isJson = false;
    } catch (e) {
      this.isJson = true;
    }
  }

  portValidate(e) {
    return !isNaN(e.key) || e.key === 'Backspace' || e.key === ','
  }

  changePatchValueServer(ips) {
    if (this.listSmServer.length !== 0) {
      const serverId = this.listSmServer.filter(v => v.ip === ips)[0]?.id;
      this.groupChartService.getServerUser({serverId: serverId}).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          this.listServerUser = res.body.results;
        } else {
          this.toastrService.danger(res.body.message, ('note'));
        }
      }, (error) => {
        this.toastrService.danger(error.error.message, 'Lỗi', {icon: 'alert-triangle-outline'});
      })
    }
  }

  changeValueActivate(event) {
    if (event.target.checked) {
      this.addForm.get('activated').patchValue(1)
    } else {
      this.addForm.get('activated').patchValue(0)
    }
  }

  // filter
  openBoxFiler() {
    this.isFilerBox = !this.isFilerBox;
  }

  addRowFilter() {
    if (this.listFilterForm.value.length <= 3) {
      this.listFilterForm.push(this.fb.group({
        typeFilter: [null, Validators.required],
        keyFilter: ['', Validators.required],
      }));
    }
    this.listChangeFilter = [];
  }

  addRowFilterSelected(i) {
    if (this.listFilterSelected.length <= 3) {
      this.arrayFilter.push(this.listFilterForm.value[0]);
      const options = {
        typeFilter: this.listFilter.filter(v => v.value === this.listFilterForm.value[0].typeFilter)[0]?.name,
        keyFilter: this.listChangeFilter[0].filter(v => v.value === this.listFilterForm.value[0].keyFilter)[0]?.name
      }
      const checkSameItem = this.listFilterSelected.some((item, index) => {
        return options?.typeFilter === item?.typeFilter;
      });
      if (checkSameItem !== true) {
        this.listFilterSelected.push(options);
      }
      this.listFilterForm.at(0).patchValue({
        typeFilter: null,
        keyFilter: null
      });
    }
    this.listChangeFilter = [];
  }

  filterChange(row, index: number) {
    const arrayResole = [];
    if (row.value.selectedFilter === null) {
      this.listChangeFilter[index] = [];
      this.listFilterForm.at(index).patchValue({
        typeFilter: null,
      });
      this.listChangeFilter = [];
      this.optionDefault = {
        keySearch: '',
        keyType: '',
        keyServer: '',
        keyTeam: ''
      };
      this.dosSearchsCm(this.optionDefault);
    } else {
      if (row.value.typeFilter === 'keyType') {
        this.listChangeFilter[index] = this.listTypeApp;
        this.listFilterForm.at(index).patchValue({
          keyFilter: null,
        });
      } else if (row.value.typeFilter === 'keyServer') {
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
    this.dosSearchsCm(this.optionDefault);
    this.listFilterSelected = [];
    this.arrayFilter = [];
    this.valueSearch2 = '';
    this.optionChange = {
      keySearch: this.valueSearch2,
      keyType: '',
      keyServer: '',
      keyTeam: ''
    }
  }

  filterWithValue() {
    this.arrayFilter.map(value => {
      this.optionChange[`${value.typeFilter}`] = value.keyFilter
    });
    this.dosSearchsCm({...this.optionChange, keySearch: this.valueSearch2});
  }

  deleteFilterSelected(index: number) {
    this.listFilterSelected = [...this.listFilterSelected].filter((e, indexs) => indexs !== index);
    this.arrayFilter = [...this.arrayFilter].filter((e, indexs) => indexs !== index);
    if (this.listFilterSelected.length === 0) {
      this.optionDefault = {
        keySearch: '',
        keyType: '',
        keyServer: '',
        keyTeam: ''
      };
      this.dosSearchsCm(this.optionDefault);
    }
  }

  typeValueResole(values) {
    return this.listTypeApp.filter(v => v.value === values)[0]?.name ? this.listTypeApp.filter(v => v.value === values)[0]?.name : 'N/A'
  }

  closePupup() {
    this.isFilerBox = false;
  }
}

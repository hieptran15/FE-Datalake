import {AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {ConfigMakeFileDbService} from '../../@core/mock/configMakeFile-Db.service';
import {ConnectionConfigFileService} from '../../@core/mock/connection-configFile.service';
import {IConfigFileDb} from '../../@core/model/configFileDb.model';
import {MakeConfigFileDbModel} from '../../@core/model/makeConfigFileDb.model';
import {NbDialogService, NbPopoverDirective, NbToastrService} from '@nebular/theme';
import {IConnection} from '../../@core/model/connection.model';
import {ConnectionModel} from '../../@core/model/connection.model';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {AuthoritiesConstant} from '../../authorities.constant';
import {PopupErrorComponent} from '../popup-error/popup-error.component';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-config-make-file-db',
  templateUrl: './config-make-file-db.component.html',
  styleUrls: ['./config-make-file-db.component.scss']
})
export class ConfigMakeFileDbComponent implements OnInit {
  temp = [];
  isLoading: boolean = false;
  search: string = '';
  idConfigFile: number;
  colunmFilter: string = 'id';
  filter: any[];
  limits = [5, 10, 15, 20];
  limit = 10;
  configFiles: IConfigFileDb[];
  connectionDb: IConnection[];
  newConnection = new ConnectionModel();
  newFileConfig = new MakeConfigFileDbModel();
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('confirmPopup') confirmPopup: TemplateRef<any>;
  columns = [
    {name: 'Id', prop: 'id', flex: 0.6},
    {name: 'Table Name', prop: 'tableName', flex: 1},
    {name: 'Is active', prop: 'isActive', flex: 1},
    {name: 'Group', prop: 'idGroup', flex: 1},
    {name: 'Location path', prop: 'locationPath', flex: 1},
    {name: 'Remove path', prop: 'removePath', flex: 1},
    {name: 'SRC', prop: 'source', flex: 1},
    {name: 'Description', prop: 'description', flex: 1},
    {name: 'Max time', prop: 'maxTime', flex: 1},
    {name: 'Command', prop: 'sqlCommand', flex: 1},
    {name: 'Command create', prop: 'createCommand', flex: 1.2},
    {name: '', prop: 'Actions', flex: 0.7}
  ];
  column = [
    {name: 'ID', prop: 'id'},
    {name: 'TABLE NAME', prop: 'tableName'},
    {name: 'IS ACTIVE', prop: 'isActive'},
    {name: 'GROUP', prop: 'idGroup'},
    {name: 'LOCATION PATH', prop: 'locationPath'},
    {name: 'REMOVE PATH', prop: 'removePath'},
    {name: 'SRC', prop: 'source'},
    {name: 'DESCRIPTION', prop: 'description'},
    {name: 'MAX TIME', prop: 'maxTime'},
    {name: 'COMMAND', prop: 'sqlCommand'},
    {name: 'COMMAND CREATE', prop: 'createCommand'},
  ];
  tableOffset = 0;
  selectedItem: number = 1;
  reorderable = true;
  authority = AuthoritiesConstant;

  constructor(
    private connectionService: ConnectionConfigFileService,
    private configMakeFileDbService: ConfigMakeFileDbService,
    private shareData: ShareDataBreadcrumbService,
    private toastrService: NbToastrService,
    public dialogService: NbDialogService,
  ) {
  }

  ngOnInit(): void {
    this.sendDataTest();
    this.getAllConfigMakeFile();
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Utility',
      titleChild: 'DB make file config',
      urlPage: '/page/config-makeFile-db',
    })
  }

  validateNumber(event: any, maxLength?: number) {
    if (event.key === 'e') {
      event.preventDefault();
    }
    if (event.key === '+') {
      event.preventDefault();
    }
    if (event.key === 'E') {
      event.preventDefault();
    }
    if (!maxLength) {
      if (event.key === '-') {
        event.preventDefault();
      }
    }
  }

  checkMaxMin(event: any, maxLength: number, name: String): void {
    if (event.key === 'e') {
      event.preventDefault();
    }
    if (event.key === '+') {
      event.preventDefault();
    }
    if (event.key === 'E') {
      event.preventDefault();
    }
    if (maxLength === 3) {
      if (event.target.value && event.target.value < -1) {
        if (event.key !== 'Backspace') {
          event.preventDefault();
          this.toastrService.danger('The minimum value of ' + name + ' is -1', 'Lỗi', {icon: 'alert-triangle-outline'});
          name === 'No of part' ? this.newFileConfig.numParts = -1 : this.newFileConfig.numExes = -1;
          event.target.value = -1;
        }
      }
      if (event.target.value && event.target.value > 999) {
        if (event.key !== 'Backspace') {
          event.preventDefault();
          name === 'No of part' ? this.newFileConfig.numParts = 999 : this.newFileConfig.numExes = 999;
          this.toastrService.danger('The maximum value of ' + name + ' is 999', 'Lỗi', {icon: 'alert-triangle-outline'});
          event.target.value = 999;
        }
      }
    }
    if (maxLength === 20) {
      if (event.key === '-') {
        event.preventDefault();
      }
      if (event.target.value && event.target.value > 9223372036854775000) {
        if (event.key !== 'Backspace') {
          event.preventDefault();
          this.toastrService.danger('The maximum value of ' + name + ' is 9223372036854775000', 'Lỗi', {icon: 'alert-triangle-outline'});
          name === 'Number of fields' ? this.newFileConfig.numFields = 9223372036854775000 : name === 'Fetch size' ? this.newFileConfig.fetchSize = 9223372036854775000 : this.newFileConfig.idGroup = 9223372036854775000;
          event.target.value = 9223372036854775000;
        }
      }
    }
    if (maxLength === 10) {
      if (event.key === '-') {
        event.preventDefault();
      }
      if (event.target.value && event.target.value > 9999999999) {
        if (event.key !== 'Backspace') {
          event.preventDefault();
          this.toastrService.danger('The maximum value of ' + name + ' is 9999999999', 'Lỗi', {icon: 'alert-triangle-outline'});
          this.newFileConfig.maxTime = 9999999999;
          event.target.value = 9999999999;
        }
      }
    }
  }

  getAllConfigMakeFile() {
    this.isLoading = true;
    this.configMakeFileDbService.getConfigFiles().subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.configFiles = res.body.results;
        this.filter = this.configFiles;
        this.getAllConnection();
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
    });
  }

  getInfoMakeFilById(id: number) {
    this.isLoading = true;
    this.idConfigFile = id;
    this.configMakeFileDbService.getConfigFile(id).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.newFileConfig = res.body.results[0];
          this.getConnectionById(this.newFileConfig.idConnection);
          this.isLoading = false
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
      });
  }

  newConfig() {
    this.newFileConfig = new MakeConfigFileDbModel();
    this.newFileConfig.numParts = -1;
    this.newFileConfig.numExes = -1;
    this.newFileConfig.usePartition = false;
    this.newFileConfig.useSubpartition = false;
    this.newFileConfig.maxTime = 1200;
    this.newFileConfig.active = true;
    this.newFileConfig.fetchSize = 20000;
  }

  addConfig(ref, ref2) {
    this.isLoading = true;
    this.configMakeFileDbService.addConfigFile(this.newFileConfig).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.getAllConfigMakeFile();
          this.toastrService.show('Action successfully', 'Notification', {status: 'success'});
          ref.close();
          ref2.close();
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
      });
  }

  editConfig(id: number, ref: any, ref2: any) {
    this.isLoading = true;
    this.configMakeFileDbService.editConfigFile(id, this.newFileConfig).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.configFiles = res.body.results;
        this.getAllConfigMakeFile();
        this.toastrService.show('Action successfully', 'Notification', {status: 'success'});
        ref.close();
        ref2.close();
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
    });
  }

  onPageChange(event: any): void {
    this.tableOffset = event.offset;
  }

  getAllConnection() {
    this.isLoading = true;
    this.connectionService.getConnections().subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.connectionDb = res.body.results;
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
    });
  }

  getConnectionById(id: number, idConfig?: number) {
    this.isLoading = true;
    this.connectionService.getConnection(id).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.newConnection = res.body.results[0];
          this.selectedItem = this.newConnection.id;
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
      });
  }

  resetConnection() {
    this.newConnection = new ConnectionModel()
  }

  deleteConfigFile(id: number, ref: any) {
    this.isLoading = true;
    this.configMakeFileDbService.deleteConfigFile(id).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.getAllConfigMakeFile();
          ref.close();
          this.isLoading = false;
          this.toastrService.show('Action successfully', 'Notification', {status: 'success'});
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
      });
  }

  addConnection(ref, ref2) {
    this.isLoading = true;
    this.connectionService.addConfigFile(this.newConnection).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.getAllConnection();
          ref.close();
          ref2.close();
          this.isLoading = false;
          this.toastrService.show('Action successfully', 'Notification', {status: 'success'});
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
      });
  }

  editConnection(ref: any, ref2) {
    this.isLoading = true;
    this.connectionService.editConnection(this.newConnection).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.getAllConnection()
          ref.close();
          ref2.close();
          this.isLoading = false;
          this.toastrService.show('Action successfully', 'Notification', {status: 'success'});
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

  validateConfig(ref, actionType: String) {
    this.configMakeFileDbService.validateConfigFile(this.newFileConfig).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.dialogService.open(this.confirmPopup, {
            context: {
              action: actionType,
              id: this.newFileConfig.id,
              ref2: ref
            }, closeOnEsc: true, hasBackdrop: true
          })
        } else {
          this.toastrService.danger(res.body.message, 'Lỗi', {icon: 'alert-triangle-outline'});
        }
      }
    )
  }

  validateConn(ref, actionType: String) {
    this.connectionService.validateConn(this.newConnection).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.dialogService.open(this.confirmPopup, {
            context: {
              action: actionType,
              id: this.newFileConfig.id,
              ref2: ref
            }, closeOnEsc: true, hasBackdrop: true
          })
        } else {
          this.toastrService.danger(res.body.message, 'Lỗi', {icon: 'alert-triangle-outline'});
        }
      }, error => {
        this.toastrService.danger('Có lỗi xảy ra. Vui lòng thử lại sau.', 'Lỗi', {icon: 'alert-triangle-outline'});
      }
    )
  }

  updateFilter(event, colunmFilter) {
    this.filter = this.configFiles
    let val = event.target.value.toString().trim().toLowerCase();
    if (colunmFilter === 'isActive') {
      if ('true'.includes(val)) {
        val = '1';
      }
      if ('false'.includes(val)) {
        val = '0';
      }
    }
    const temp = this.filter.filter(d => {
      if (colunmFilter === 'isActive') {
        return d[colunmFilter].toString().toLowerCase().indexOf(val) !== -1 || !val;
      } else {
        d[colunmFilter] = d[colunmFilter] || '';
        return d[colunmFilter].toString().toLowerCase().indexOf(val) !== -1 || !val;
      }
    });
    this.filter = temp;
    this.table.offset = 0;
  }

  onchange() {
    this.search = '';
    this.filter = this.configFiles;
  }

  copyText(value: any) {
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
}

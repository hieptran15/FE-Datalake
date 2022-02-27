import {Component, OnInit} from '@angular/core';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {ConnectionManagementService} from '../../../@core/mock/connection-management.service';
import {NewConnectionComponent} from './new-connection/new-connection.component';
import {messages} from '../../extra-components/chat/messages';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {LanguageService} from '../../../@core/mock/language.service';
import {AuthoritiesConstant} from '../../../authorities.constant';
import {ShareDataBreadcrumbService} from '../../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-connection-management',
  templateUrl: './connection-management.component.html',
  styleUrls: ['./connection-management.component.scss']
})
export class ConnectionManagementComponent implements OnInit {
  nameConnection: string = '';
  typeConnection = '';
  isLoading: boolean = false;
  rows = [];
  limits = [5, 10, 15, 20];
  limit = 10;
  connections = ['FTP', 'HDFS', 'Kafka', 'RDBMS', 'HIVE'];
  columns = [
    {name: 'ID', prop: 'id', flex: 0.5},
    {name: 'connection-manager.column.nameConnection', prop: 'connectionName', flex: 1},
    {name: 'connection-manager.column.typeConnection', prop: 'connectionType', flex: 1},
    {name: 'connection-manager.column.numberOfThreadsUsed', prop: 'count', flex: 1},
    {name: 'connection-manager.column.createAt', prop: 'createdAt', flex: 1},
    {name: 'connection-manager.column.action', prop: 'Action', flex: 0.5}
  ];
  authoritiesConstant = AuthoritiesConstant

  constructor(
    private connectionManagementService: ConnectionManagementService,
    private toastrService: NbToastrService,
    public dialogService: NbDialogService,
    private shareData: ShareDataBreadcrumbService,
    private languageService: LanguageService,
  ) {
  }

  ngOnInit(): void {
    this.sendDataTest();
    this.doSearch();
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Utility',
      groupText: 'Ingestion & Provisioning',
      titleChild: 'Connection manager',
      urlPage: '/page/connection-Management',
    })
  }

  checkConnection(e?) {
    if (!e) {
      this.typeConnection = '';
    } else {
      this.typeConnection = e;
    }
    this.doSearch();
  }

  doSearch() {
    this.isLoading = true;
    let obj = {}
    obj = {
      connectionName: this.nameConnection,
      connectionType: this.typeConnection
    }
    console.log(obj)
    this.connectionManagementService.doSearch(obj).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.rows = res.body.results;
        this.isLoading = false;
      }
    }, error => {
      this.toastrService.danger(error.error.message, 'Error'/*, {icon: 'alert-triangle-outline'}*/);
    });
  }

  // kien-------------------------------------------

  newConnection() {
    this.dialogService.open(NewConnectionComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        connType: 'FTP'
      },
    }).onClose.subscribe(onClose => {
      if (onClose) {
        this.doSearch();
      }
    });
  }

  edit(index: number) {
    const connType = this.rows[index].connectionType
    const id = this.rows[index].id
    switch (connType) {
      case 'HDFS': {
        this.connectionManagementService.searchHdfs(id).subscribe(
          res => {
            if (res.body.responseType === 'SUCCESS') {
              this.dialogService.open(NewConnectionComponent, {
                closeOnBackdropClick: false,
                closeOnEsc: false,
                context: {
                  connection: res.body.results[0],
                  connType: connType
                },
              }).onClose.subscribe(onClose => {
                if (onClose) {
                  this.doSearch();
                }
              });
            } else {
              this.toastrService.danger(res.body.message, 'Error')
            }
          }, error => {
            this.toastrService.danger(error.error.message, 'Error')
          }
        )
        break;
      }
      case 'Kafka': {
        this.connectionManagementService.searchKafka(id).subscribe(
          res => {
            if (res.body.responseType === 'SUCCESS') {
              this.dialogService.open(NewConnectionComponent, {
                closeOnBackdropClick: false,
                closeOnEsc: false,
                context: {
                  connection: res.body.results[0],
                  connType: connType
                },
              }).onClose.subscribe(onClose => {
                if (onClose) {
                  this.doSearch();
                }
              });
            } else {
              this.toastrService.danger(res.body.message, 'Error')
            }
          }, error => {
            this.toastrService.danger(error.error.message, 'Error')
          }
        )
        break;
      }
      case 'FTP': {
        this.connectionManagementService.searchFtp(id).subscribe(
          res => {
            if (res.body.responseType === 'SUCCESS') {
              this.dialogService.open(NewConnectionComponent, {
                closeOnBackdropClick: false,
                closeOnEsc: false,
                context: {
                  connection: res.body.results[0],
                  connType: connType
                },
              }).onClose.subscribe(onClose => {
                if (onClose) {
                  this.doSearch();
                }
              });
            } else {
              this.toastrService.danger(res.body.message, 'Error')
            }
          }, error => {
            this.toastrService.danger(error.error.message, 'Error')
          }
        )
        break;
      }
      case 'RDBMS': {
        this.connectionManagementService.searchRdbms(id).subscribe(
          res => {
            if (res.body.responseType === 'SUCCESS') {
              this.dialogService.open(NewConnectionComponent, {
                closeOnBackdropClick: false,
                closeOnEsc: false,
                context: {
                  connection: res.body.results[0],
                  connType: connType
                },
              }).onClose.subscribe(onClose => {
                if (onClose) {
                  this.doSearch();
                }
              });
            } else {
              this.toastrService.danger(res.body.message, 'Error')
            }
          }, error => {
            this.toastrService.danger(error.error.message, 'Error')
          }
        )
        break;
      }
      case 'HIVE': {
        this.connectionManagementService.searchHive(id).subscribe(
          res => {
            if (res.body.responseType === 'SUCCESS') {
              this.dialogService.open(NewConnectionComponent, {
                closeOnBackdropClick: false,
                closeOnEsc: false,
                context: {
                  connection: res.body.results[0],
                  connType: connType
                },
              }).onClose.subscribe(onClose => {
                if (onClose) {
                  this.doSearch();
                }
              });
            } else {
              this.toastrService.danger(res.body.message, 'Error')
            }
          }, error => {
            this.toastrService.danger(error.error.message, 'Error')
          }
        )
        break;
      }
    }
  }
}

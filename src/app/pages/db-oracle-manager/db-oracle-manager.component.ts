import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NbDialogService} from '@nebular/theme';
import {PopupErrorComponent} from '../popup-error/popup-error.component';
import {DbOracleManagerService} from '../../services/db-oracle-manager.service';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-db-oracle-manager',
  templateUrl: './db-oracle-manager.component.html',
  styleUrls: ['./db-oracle-manager.component.scss']
})
export class DbOracleManagerComponent implements OnInit {
  @ViewChild('DBEmpty') DBEmpty: TemplateRef<any>
  isPupupDB: boolean = false;
  isDBSelected = 'DB_INFO';
  dbItems: any;
  DBname: any;
  listDB = [];

  constructor(public dialogService: NbDialogService, private dbOracleService: DbOracleManagerService, private shareData: ShareDataBreadcrumbService) {
  }

  ngOnInit(): void {
    this.sendDataTest();
    this.getAllDbOracle();
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Utility',
      titleChild: 'DB Oracle manager',
      urlPage: '/page/db-oracle-manager',
    })
  }

  getAllDbOracle() {
    this.dbOracleService.getAllDbOracle({}).subscribe(res => {
      this.listDB = res.body.results;
      this.dbItems = this.listDB[0];
      if (this.listDB.length !== 0) {
        this.DBname = this.listDB[0]?.dbName;
      } else {
        this.DBname = '';
      }
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
    })
  }

  checkDBKey(key: string) {
    this.isDBSelected = key;
    if (key === 'DB_INFO') {
      this.isPupupDB = false;
      this.getAllDbOracle();
    } else {
      if (this.listDB.length === 0) {
        this.dialogService.open(this.DBEmpty, {closeOnBackdropClick: false})
      }
      this.isPupupDB = true;
    }
  }

  changeDB(items) {
    this.dbItems = items;
  }

  dataDbInfo(event) {
    this.isPupupDB = false;
    this.getAllDbOracle();
  }

  closeNoteEmptyDB(dgRef) {
    this.isDBSelected = 'DB_INFO';
    this.isPupupDB = false;
    dgRef.close();
  }
}

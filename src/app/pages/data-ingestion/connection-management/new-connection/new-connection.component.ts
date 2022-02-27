import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NbDialogRef, NbDialogService, NbToastrService} from '@nebular/theme';
import {ConnectionManagementService} from '../../../../@core/mock/connection-management.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ngx-new-connection',
  templateUrl: './new-connection.component.html',
  styleUrls: ['./new-connection.component.scss']
})
export class NewConnectionComponent implements OnInit {
  connTypes = ['FTP', 'RDBMS', 'Kafka', 'HDFS', 'HIVE']
  connMode = ['Passive', 'Active']
  connType = '';
  connectionName = '';
  connection = {};
  isLoading: boolean = false;
  isObj: boolean = false;
  isConn: boolean = false;
  ftpForm: FormGroup;
  hiveForm: FormGroup;
  rdbmsForm: FormGroup;
  kafkaForm: FormGroup;
  hdfsForm: FormGroup;
  showPassword = false;

  constructor(private connectionServices: ConnectionManagementService,
              private toastrService: NbToastrService,
              public fb: FormBuilder,
              public translate: TranslateService,
              public dialogService: NbDialogService,
              public ref: NbDialogRef<NewConnectionComponent>
  ) {
    this.ftpForm = this.fb.group({
      id: [null],
      ftpServer: [null, [Validators.required]],
      ftpPort: [null, [Validators.required]],
      ftpUsername: [null, [Validators.required]],
      ftpPassword: [null],
      connectionMode: ['Passive', [Validators.required]],
      remotePollBatchSize: [30000],
      connectionTimeout: ['30 sec'],
      dataTimeout: ['30 sec'],
      connectionName: [null],
      connectionType: [null],
    }),
      this.hiveForm = this.fb.group({
        id: [null],
        connectionName: [null],
        connectionType: [null],
        maxTotalConnection: [null],
        maxWaitTime: [null],
        databasePassword: [null, [Validators.required]],
        databaseUser: [null, [Validators.required]],
        hiveConfigResources: [null],
        databaseUrl: [null, [Validators.required]],
      })
    this.kafkaForm = this.fb.group({
      kafkaBrokers: [null, [Validators.required]],
      connectionName: [null],
      id: [null],
      connectionType: [null]
    }),
      this.rdbmsForm = this.fb.group({
        connectionName: [null],
        dbConnectionUrl: [null, [Validators.required]],
        dbDriverClassname: [null, [Validators.required]],
        dbDriverLocations: [null, [Validators.required]],
        dbUsername: [null, [Validators.required]],
        dbPassword: [null, [Validators.required]],
        connectionType: [null],
        id: [null],
        advancedConfig: [null]
      }),
      this.hdfsForm = this.fb.group({
        hdfsResource: [null, [Validators.required]],
        connectionType: [null],
        id: [null],
        connectionName: [null],
      });
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

  ngOnInit(): void {
    this.setValue();
  }

  save(refConfirm?: any) {
    this.isLoading = true;
    switch (this.connType) {
      case 'HDFS': {
        this.hdfsForm.get('connectionName').patchValue(this.connectionName)
        this.hdfsForm.get('connectionType').patchValue(this.connType)
        this.connectionServices.addHdfs(this.hdfsForm.value, this.hdfsForm.value.id).subscribe(
          res => {
            if (res.body.responseType === 'SUCCESS') {
              this.isLoading = false;
              if (this.hdfsForm.value.id == null) {
                this.toastrService.success(this.translate.instant('success.http.addSuccess'), this.translate.instant('success.http.notify'))
              } else {
                this.toastrService.success(this.translate.instant('success.http.editSuccess'), this.translate.instant('success.http.notify'))
              }
              this.ref.close({message: 'close'});
            } else {
              this.isLoading = false;
              if (res.body.message === '01') {
                this.toastrService.danger(this.translate.instant('error.http.duplicateName'), this.translate.instant('error.http.errors'))
              }
            }
          }, error => {
            this.isLoading = false;
            this.toastrService.danger(error.error.message, 'Error')
          }
        )
        break;
      }
      case 'Kafka': {
        this.kafkaForm.get('connectionName').patchValue(this.connectionName)
        this.kafkaForm.get('connectionType').patchValue(this.connType)
        this.connectionServices.addKafka(this.kafkaForm.value, this.kafkaForm.value.id).subscribe(
          res => {
            this.isLoading = false;
            if (res.body.responseType === 'SUCCESS') {
              if (this.kafkaForm.value.id == null) {
                this.toastrService.success(this.translate.instant('success.http.addSuccess'), this.translate.instant('success.http.notify'))
              } else {
                this.toastrService.success(this.translate.instant('success.http.editSuccess'), this.translate.instant('success.http.notify'))
              }
              this.ref.close({message: 'close'});
            } else {
              if (res.body.message === '01') {
                this.toastrService.danger(this.translate.instant('error.http.duplicateName'), this.translate.instant('error.http.errors'))
              }
            }
          }, error => {
            this.isLoading = false;
            this.toastrService.danger(error.error.message, 'Error')
          }
        )
        break;
      }
      case 'FTP': {
        this.ftpForm.get('connectionName').patchValue(this.connectionName)
        this.ftpForm.get('connectionType').patchValue(this.connType)
        this.connectionServices.addFtp(this.ftpForm.value, this.ftpForm.value.id).subscribe(
          res => {
            this.isLoading = false;
            if (res.body.responseType === 'SUCCESS') {
              if (this.ftpForm.value.id == null)
                this.toastrService.success(this.translate.instant('success.http.addSuccess'), this.translate.instant('success.http.notify'))
              else {
                this.toastrService.success(this.translate.instant('success.http.editSuccess'), this.translate.instant('success.http.notify'))
              }
              this.ref.close({message: 'close'});
            } else {
              if (res.body.message === '01') {
                this.toastrService.danger(this.translate.instant('error.http.duplicateName'), this.translate.instant('error.http.errors'))
              }
            }
          }, error => {
            this.isLoading = false;
            this.toastrService.danger(error.error.message, this.translate.instant('error.http.errors'))
          }
        )
        break;
      }
      case 'RDBMS': {
        this.rdbmsForm.get('connectionName').patchValue(this.connectionName)
        this.rdbmsForm.get('connectionType').patchValue(this.connType)
        this.connectionServices.addRdbms(this.rdbmsForm.value, this.rdbmsForm.value.id).subscribe(
          res => {
            this.isLoading = false;
            if (res.body.responseType === 'SUCCESS') {
              if (this.rdbmsForm.value.id == null)
                this.toastrService.success(this.translate.instant('success.http.addSuccess'), this.translate.instant('success.http.notify'))
              else {
                this.toastrService.success(this.translate.instant('success.http.editSuccess'), this.translate.instant('success.http.notify'))
              }
              this.ref.close({message: 'close'});
            } else {
              if (res.body.message === '01') {
                this.toastrService.danger(this.translate.instant('error.http.duplicateName'), this.translate.instant('error.http.errors'))
              }
            }
          }, error => {
            this.isLoading = false;
            this.toastrService.danger(error.error.message, 'Error')
          }
        )
        break;
      }
      case 'HIVE': {
        this.hiveForm.get('connectionName').patchValue(this.connectionName)
        this.hiveForm.get('connectionType').patchValue(this.connType)
        this.connectionServices.addHIVE(this.hiveForm.value, this.hiveForm.value.id).subscribe(
          res => {
            this.isLoading = false;
            if (res.body.responseType === 'SUCCESS') {
              if (this.hiveForm.value.id == null)
                this.toastrService.success(this.translate.instant('success.http.addSuccess'), this.translate.instant('success.http.notify'))
              else {
                this.toastrService.success(this.translate.instant('success.http.editSuccess'), this.translate.instant('success.http.notify'))
              }
              this.ref.close({message: 'close'});
            } else {
              if (res.body.errorCode === '01') {
                this.toastrService.danger(this.translate.instant('error.http.duplicateName'), this.translate.instant('error.http.errors'))
              }
            }
          }, error => {
            this.isLoading = false;
            this.toastrService.danger(error.error.message, 'Error')
          }
        )
        break;
      }
    }
  }

  isNumber(e) {
    return !isNaN(e.key) || e.key === 'Backspace'
  }

  setValue() {
    switch (this.connType) {
      case 'HDFS': {
        this.connectionName = this.connection['connectionName'];
        this.hdfsForm.patchValue(this.connection);
        break;
      }
      case 'Kafka': {
        this.connectionName = this.connection['connectionName'];
        this.kafkaForm.patchValue(this.connection);
        break;
      }
      case 'FTP': {
        this.connectionName = this.connection['connectionName'];
        this.ftpForm.patchValue(this.connection);
        break;
      }
      case 'RDBMS': {
        this.connectionName = this.connection['connectionName'];
        this.rdbmsForm.patchValue(this.connection);
        break;
      }
      case 'HIVE': {
        this.connectionName = this.connection['connectionName'];
        this.hiveForm.patchValue(this.connection);
        break;
      }
    }
  }

  isJson(e) {
    /*   console.log(e.target.value)
       this.isObj = true;
       if (typeof e.target.value === 'object') {
         this.isObj = false;
       }*/
    try {
      JSON.parse(e.target.value)
      this.isObj = false;
    } catch (e) {
      this.isObj = true;
    }
  }

  isConnection(e) {
    this.isConn = true;
    if (e.target.value) {
      this.isConn = false
    }
  }

  resetFrom() {
    this.rdbmsForm.reset();
    this.ftpForm.reset();
    this.ftpForm.get('connectionTimeout').patchValue('30 sec')
    this.ftpForm.get('dataTimeout').patchValue('30 sec')
    this.ftpForm.get('remotePollBatchSize').patchValue(30000)
    this.ftpForm.get('remotePollBatchSize').patchValue('Passive')
    this.hiveForm.get('maxWaitTime').patchValue(500)
    this.hiveForm.get('maxTotalConnection').patchValue(8)
    this.kafkaForm.reset();
    this.hdfsForm.reset();
    this.connectionName = '';
  }

  scroll(target: HTMLElement): void {
    target.scrollIntoView({block: 'center', behavior: 'smooth'});
  }
}

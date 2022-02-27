import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef, NbDialogService, NbToastrService} from '@nebular/theme';
import {DataIngestionService} from '../../../../services/data-ingestion.service';
import {FormBuilder, Validators} from '@angular/forms';
import {NewConnectionComponent} from '../../connection-management/new-connection/new-connection.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ngx-add-thread',
  templateUrl: './add-thread.component.html',
  styleUrls: ['./add-thread.component.scss']
})
export class AddThreadComponent implements OnInit {
  @Input() selectProvisioning
  context;
  flow: any;
  formGroup;
  isJson: boolean;
  isLoading: boolean = false;
  isSec: boolean = false;
  keyChecked = 'fpt'
  valueIngestion: any;
  listDBType = [{name: 'MySQL', value: 'MySQL'}, {name: 'Oracle', value: 'Oracle'}, {
    name: 'Oracle 12+',
    value: 'Oracle 12+'
  }, {name: 'MS SQL 2012+', value: 'MS SQL 2012+'}, {name: 'MS SQL 2008', value: 'MS SQL 2008'}]
  listDelimiter = [{name: '. (dấu chấm)', value: '.'}, {name: ', (dấu phẩy)', value: ','}, {
    name: '; (dấu chấm phẩy)',
    value: ';'
  }, {name: '| (dấu xổ dọc)', value: '|'}, {name: '% (dấu phần trăm)', value: '%'}];
  listChooseOutPutFormat = ['CSV', 'Avro'];
  listChooseCsvHeader = ['true', 'false']
  listDestination = [];
  listCalendar = [{name: 'Timer Driven', value: 'TIMER_DRIVEN'}, {name: 'CRON Driven', value: 'CRON_DRIVEN'}];
  listConnectionForFTP = [];
  listConnectionForSinkFTP = [];
  listConnectionForHDFS = [];
  listConnectionForKafka = [];
  listConnectionForRDBMS = [];
  listConnectionForHIVE = [];
  listGroup = [];
  listLogLevel = [{name: 'DEBUG', value: 'DEBUG'}, {name: 'INFO', value: 'INFO'}, {
    name: 'WARN',
    value: 'WARN'
  }, {name: 'ERROR', value: 'ERROR'}, {name: 'NONE', value: 'NONE'}]
  listSource = [{name: 'FTP', value: 'FTP'}, {name: 'RDBMS', value: 'RDBMS'}, {name: 'HIVE', value: 'HIVE'}];
  objectFTP = {ftpServer: null, ftpPort: null, ftpUsername: null, ftpPassword: null};
  objectHDFS = {objectHDFS: null};
  objectKafka = {kafkaBrokers: null};
  objectSinkFTP = {ftpServer: null, ftpPort: null, ftpUsername: null, ftpPassword: null};
  objectHive = {
    databaseUrl: null,
    hiveConfigResources: null,
    databaseUser: null,
    databasePassword: null,
    maxWaitTime: null,
    maxTotalConnection: null
  };
  objectRDBMS = {
    dbConnectionUrl: null,
    dbDriverClassname: null,
    dbDriverLocations: null,
    dbUsername: null,
    dbPassword: null
  };
  oldSource;
  oldSink;
  showPassword = false;
  showPasswordFTP = false;

  constructor(
    private ref: NbDialogRef<AddThreadComponent>,
    private dataIngestionService: DataIngestionService,
    private fb: FormBuilder,
    public translate: TranslateService,
    private toastrService: NbToastrService,
    public dialogService: NbDialogService
  ) {
    this.formGroup = this.fb.group({
      flowName: [null, [Validators.required]],
      group: [null],
      description: [null],
      sourceType: [null],
      sourceId: [null],
      sourceConfig: [null],
      sinkType: [null],
      sinkId: [null],
      sinkConfig: [null],
      advancedConfig: [null],
      scheduleStrategy: [null],
      schedulePeriod: [null, [Validators.required]],
      concurrentTask: [null, [Validators.required]],
      bulletinLevel: [null],
      path: [null, [Validators.required]],
      pathSink: [null, [Validators.required]],
      delimiter: [null, Validators.required],
      outPutFormat: [null],
      csvHeader: [null],
      isCompression: [false],
      isCompressionSink: [false],
      isAddAttribute: [false],
      isHaveSubfolder: [false],
      isHaveSubfolderSink: [false],
      deltaTimezone: [null],
      dbType: [null],
      sqlQuery: [null],
      fetchSize: [null],
      maxRow: [null],
      hdfsPath: [null, [Validators.required]],
      hdfsGroup: [null],
      hdfsUser: [null],
      kafkaTopics: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.selectProvisioning === 'Provisioning') {
      this.listSource = [{name: 'HIVE', value: 'HIVE'}];
      this.listDestination = [{name: 'FTP', value: 'FTP'}];
    } else {
      this.listSource = [{name: 'FTP', value: 'FTP'}, {name: 'RDBMS', value: 'RDBMS'}];
      this.listDestination = [{name: 'HDFS', value: 'HDFS'}, {name: 'Kafka', value: 'Kafka'}];
    }
    this.createGroups();
    this.formGroup.get('sourceType').valueChanges.subscribe(value => {
      if (value) {
        if (value === 'FTP') {
          this.createListConnectionByFTP();
          this.resetFTP();
        } else if (value === 'RDBMS') {
          this.createListConnectionByRDBMS();
          this.resetRDBMS();
        } else {
          this.createListConnectionByHIVE();
          this.resetHIVE();
        }
      }
    });
    this.formGroup.get('sinkType').valueChanges.subscribe(value => {
      if (value) {
        if (value === 'HDFS') {
          this.createListConnectionByHDFS();
          this.resetHDFS();
        } else if (value === 'Kafka') {
          this.createListConnectionByKafka();
          this.resetKafka();
        } else {
          this.createListConnectionBySinkFTP();
          this.resetSinkFTP();
        }
      }
    });
    if (this.flow) {
      this.listSource = [{name: 'FTP', value: 'FTP'}, {name: 'RDBMS', value: 'RDBMS'}, {name: 'HIVE', value: 'HIVE'}];
      this.listDestination = [{name: 'HDFS', value: 'HDFS'}, {name: 'Kafka', value: 'Kafka'}, {
        name: 'FTP',
        value: 'FTP'
      }]
      this.setValueFlow();
    } else {
      this.generateNewFlow();
    }
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

  getInputTypeFTP() {
    if (this.showPasswordFTP) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPasswordFTP() {
    this.showPasswordFTP = !this.showPasswordFTP;
  }

  generateNewFlow() {
    this.formGroup.get('sourceType').patchValue(this.listSource[0].name);
    this.formGroup.get('sinkType').patchValue(this.listDestination[0].name);
    this.formGroup.get('bulletinLevel').patchValue('WARN');
    this.formGroup.get('scheduleStrategy').patchValue('TIMER_DRIVEN');
    this.createGroups();
    this.createListConnectionByFTP();
  }

  setValueFlow() {
    console.log(this.flow)
    this.formGroup.patchValue({
      flowName: this.flow.flowName,
      // group: this.flow.groupId,
      description: this.flow.description,
      sourceType: this.flow.sourceConnectionType,
      // sourceId: this.flow.sourceConnectionId,
      sourceConfig: JSON.stringify(this.flow.sourceConfig),
      sinkType: this.flow.sinkConnectionType,
      // sinkId: this.flow.sinkConnectionId,
      sinkConfig: JSON.stringify(this.flow.sinkConfig),
      advancedConfig: this.flow.flowAdvancedConfig,
      scheduleStrategy: this.flow.scheduleStrategy,
      schedulePeriod: this.flow.schedulingPeriod?.toLowerCase(),
      concurrentTask: this.flow.concurrentTask,
      bulletinLevel: this.flow.bulletinLevel,
      path: this.flow.sourceConfig.ftp_path,
      delimiter: this.flow.sourceConfig.delimiter,
      isCompression: this.flow.sourceConfig.is_compression,
      isAddAttribute: this.flow.sourceConfig.is_add_attribute,
      isHaveSubfolder: this.flow.sourceConfig.is_have_subfolder,
      deltaTimezone: this.flow.sourceConfig.delta_time_zone,
      dbType: this.flow.sourceConfig['Database Type'],
      sqlQuery: this.flow.sourceConfig.query,
      fetchSize: this.flow.sourceConfig.fetch_size,
      maxRow: this.flow.sourceConfig.max_rows_per_file,
      hdfsPath: this.flow.sinkConfig.hdfs_path,
      hdfsGroup: this.flow.sinkConfig.hdfs_owner_group,
      hdfsUser: this.flow.sinkConfig.hdfs_owner_user,
      kafkaTopics: this.flow.sinkConfig.topic,
      csvHeader: this.flow.sourceConfig.csvHeader,
      outPutFormat: this.flow.sourceConfig.outPutFormat,
      pathSink: this.flow.sinkConfig.ftp_path,
      isCompressionSink: this.flow.sinkConfig.is_compression,
      isHaveSubfolderSink: this.flow.sinkConfig.is_have_subfolder,
    });
    console.log(this.flow.sinkConfig)
  }

  resetFTP() {
    this.oldSource = null;
    this.formGroup.get('path').patchValue(null);
    this.formGroup.get('path').touched = false;
    this.formGroup.get('delimiter').patchValue(null);
    this.formGroup.get('delimiter').touched = false;
    this.formGroup.get('isCompression').patchValue(false);
    this.formGroup.get('isAddAttribute').patchValue(false);
    this.formGroup.get('isHaveSubfolder').patchValue(false);
    this.formGroup.get('deltaTimezone').patchValue(null);
  }

  resetRDBMS() {
    this.oldSource = null;
    this.formGroup.get('dbType').patchValue('Oracle');
    this.formGroup.get('delimiter').patchValue('|');
    this.formGroup.get('sqlQuery').patchValue(null);
    this.formGroup.get('fetchSize').patchValue(30000);
    this.formGroup.get('maxRow').patchValue(30000);
    this.formGroup.get('deltaTimezone').patchValue(0);
    this.formGroup.get('isAddAttribute').patchValue(false);
  }

  resetHIVE() {
    this.oldSource = null;
    this.formGroup.get('delimiter').patchValue('|');
    this.formGroup.get('sqlQuery').patchValue(null);
    this.formGroup.get('fetchSize').patchValue(30000);
    this.formGroup.get('maxRow').patchValue(30000);
  }

  resetHDFS() {
    this.oldSink = null;
    this.formGroup.get('hdfsPath').patchValue(null);
    this.formGroup.get('hdfsPath').touched = false;
    this.formGroup.get('hdfsGroup').patchValue(null);
    this.formGroup.get('hdfsGroup').touched = false;
    this.formGroup.get('hdfsUser').patchValue(null);
    this.formGroup.get('hdfsUser').touched = false;
  }

  resetKafka() {
    this.oldSink = null;
    this.formGroup.get('kafkaTopics').patchValue(null);
    this.formGroup.get('kafkaTopics').touched = false;
  }

  resetSinkFTP() {
    this.oldSink = null;
  }

  createGroups() {
    this.isLoading = true;
    this.dataIngestionService.getAllListGroup().subscribe(res => {
      this.isLoading = false;
      if (res.body.results && res.body.results.length) {
        this.listGroup = res.body.results;
        this.formGroup.get('group').patchValue(this.flow ? this.flow.groupId : this.listGroup[0].id);
      }
    }, error => {
      this.isLoading = false;
      this.toastrService.danger(error.error.message, 'Error')
    });
  }

  createListConnectionByFTP() {
    this.isLoading = true;
    this.dataIngestionService.getListConnectionByType({connectionName: '', connectionType: 'FTP'}).subscribe(res => {
      this.isLoading = false;
      if (res.body.results && res.body.results.length) {
        this.listConnectionForFTP = res.body.results;
        !this.oldSource && (this.oldSource = this.flow ? {id: this.flow.sourceConnectionId} : this.listConnectionForFTP[0]);
        this.formGroup.get('sourceId').patchValue(this.oldSource.id);
        this.changeFTP(this.oldSource);
        this.listConnectionForFTP = [{id: 0, connectionName: 'Tạo mới'}, ...this.listConnectionForFTP];
      }
    }, error => {
      this.isLoading = false;
      this.toastrService.danger(error.error.message, 'Error')
    });
  }

  createListConnectionByRDBMS() {
    this.isLoading = true;
    this.dataIngestionService.getListConnectionByType({connectionName: '', connectionType: 'RDBMS'}).subscribe(res => {
      this.isLoading = false;
      if (res.body.results && res.body.results.length) {
        this.listConnectionForRDBMS = res.body.results;
        !this.oldSource && (this.oldSource = this.flow ? {id: this.flow.sourceConnectionId} : this.listConnectionForRDBMS[0]);
        this.formGroup.get('sourceId').patchValue(this.oldSource.id);
        this.changeRDBMS(this.oldSource);
        this.listConnectionForRDBMS = [{id: 0, connectionName: 'Tạo mới'}, ...this.listConnectionForRDBMS];
      }
    }, error => {
      this.isLoading = false;
      this.toastrService.danger(error.error.message, 'Error')
    });
  }

  createListConnectionByHIVE() {
    this.isLoading = true;
    this.dataIngestionService.getListConnectionByType({connectionName: '', connectionType: 'HIVE'}).subscribe(res => {
      this.isLoading = false;
      if (res.body.results && res.body.results.length) {
        this.listConnectionForHIVE = res.body.results;
        !this.oldSource && (this.oldSource = this.flow ? {id: this.flow.sourceConnectionId} : this.listConnectionForHIVE[0]);
        this.formGroup.get('sourceId').patchValue(this.oldSource.id);
        this.changeHIVE(this.oldSource);
        this.listConnectionForHIVE = [{id: 0, connectionName: 'Tạo mới'}, ...this.listConnectionForHIVE];
      }
    }, error => {
      this.isLoading = false;
      this.toastrService.danger(error.error.message, 'Error')
    });
  }

  createListConnectionByHDFS() {
    this.isLoading = true;
    this.dataIngestionService.getListConnectionByType({connectionName: '', connectionType: 'HDFS'}).subscribe(res => {
      this.isLoading = false;
      if (res.body.results && res.body.results.length) {
        this.listConnectionForHDFS = res.body.results;
        !this.oldSink && (this.oldSink = this.flow ? {id: this.flow.sinkConnectionId} : this.listConnectionForHDFS[0]);
        this.formGroup.get('sinkId').patchValue(this.oldSink.id);
        this.changeHDFS(this.oldSink);
        this.listConnectionForHDFS = [{id: 0, connectionName: 'Tạo mới'}, ...this.listConnectionForHDFS];
      }
    }, error => {
      this.isLoading = false;
      this.toastrService.danger(error.error.message, 'Error')
    });
  }

  createListConnectionByKafka() {
    this.dataIngestionService.getListConnectionByType({connectionName: '', connectionType: 'Kafka'}).subscribe(res => {
      this.isLoading = false;
      if (res.body.results && res.body.results.length) {
        this.listConnectionForKafka = res.body.results;
        !this.oldSink && (this.oldSink = this.flow ? {id: this.flow.sinkConnectionId} : this.listConnectionForKafka[0]);
        this.formGroup.get('sinkId').patchValue(this.oldSink.id);
        this.changeKafka(this.oldSink);
        this.listConnectionForKafka = [{id: 0, connectionName: 'Tạo mới'}, ...this.listConnectionForKafka];
      }
    }, error => {
      this.isLoading = false;
      this.toastrService.danger(error.error.message, 'Error')
    });
  }

  createListConnectionBySinkFTP() {
    this.dataIngestionService.getListConnectionByType({connectionName: '', connectionType: 'FTP'}).subscribe(res => {
      this.isLoading = false;
      if (res.body.results && res.body.results.length) {
        this.listConnectionForSinkFTP = res.body.results;
        !this.oldSink && (this.oldSink = this.flow ? {id: this.flow.sinkConnectionId} : this.listConnectionForSinkFTP[0]);
        this.formGroup.get('sinkId').patchValue(this.oldSink.id);
        this.changeSinkFPT(this.oldSink);
        this.listConnectionForSinkFTP = [{id: 0, connectionName: 'Tạo mới'}, ...this.listConnectionForSinkFTP];
      }
    }, error => {
      this.isLoading = false;
      this.toastrService.danger(error.error.message, 'Error')
    });
  }

  changeSource(event) {
    if (event.value === 'FTP') {
      this.listDestination = [{name: 'HDFS', value: 'HDFS'}, {name: 'Kafka', value: 'Kafka'}];
    } else if (event.value === 'RDBMS') {
      this.listDestination = [{name: 'HDFS', value: 'HDFS'}];
    } else {
      this.listDestination = [{name: 'FTP', value: 'FTP'}];
    }
    this.formGroup.get('sinkType').patchValue(this.listDestination[0].name);
  }

  closePopup() {
    this.ref.close();
  }

  creatFlow() {
    let sourceConf, sinkConf;
    if (this.selectProvisioning === 'Provisioning') {
      this.valueIngestion = 0
    } else {
      this.valueIngestion = 1
    }
    if (this.formGroup.value.sourceType === 'FTP') {
      sourceConf = {
        ftp_path: this.formGroup.value.path,
        delimiter: this.formGroup.value.delimiter,
        delta_time_zone: this.formGroup.value.deltaTimezone,
        is_compression: this.formGroup.value.isCompression,
        is_add_attribute: this.formGroup.value.isAddAttribute,
        is_have_subfolder: this.formGroup.value.isHaveSubfolder
      }
    } else if (this.formGroup.value.sourceType === 'RDBMS') {
      sourceConf = {
        'Database Type': this.formGroup.value.dbType,
        delimiter: this.formGroup.value.delimiter,
        delta_time_zone: Number(this.formGroup.value.deltaTimezone),
        fetch_size: this.formGroup.value.fetchSize,
        max_rows_per_file: Number(this.formGroup.value.maxRow),
        query: this.formGroup.value.sqlQuery,
        is_add_attribute: this.formGroup.value.isAddAttribute
      }
    } else {
      sourceConf = {
        query: this.formGroup.value.sqlQuery,
        delimiter: this.formGroup.value.delimiter,
        csvHeader: this.formGroup.value.csvHeader,
        outPutFormat: this.formGroup.value.outPutFormat,
        fetch_size: this.formGroup.value.fetchSize,
        max_rows_per_file: Number(this.formGroup.value.maxRow),
      }
    }
    if (this.formGroup.value.sinkType === 'HDFS') {
      sinkConf = {
        hdfs_path: this.formGroup.value.hdfsPath,
        hdfs_owner_group: this.formGroup.value.hdfsGroup,
        hdfs_owner_user: this.formGroup.value.hdfsUser
      }
    } else if (this.formGroup.value.sinkType === 'Kafka') {
      sinkConf = {
        topic: this.formGroup.value.kafkaTopics
      }
    } else {
      sinkConf = {
        ftp_path: this.formGroup.value.pathSink,
        is_compression: this.formGroup.value.isCompressionSink,
        is_have_subfolder: this.formGroup.value.isHaveSubfolderSink,
      }
    }
    let obj;
    if (this.flow) {
      obj = this.flow;
      obj.flowName = this.formGroup.value.flowName;
      obj.description = this.formGroup.value.description;
      obj.sourceConfig = JSON.stringify(sourceConf);
      obj.sinkConfig = JSON.stringify(sinkConf);
      obj.flowAdvancedConfig = this.formGroup.value.advancedConfig;
      obj.scheduleStrategy = this.formGroup.value.scheduleStrategy;
      obj.schedulingPeriod = this.formGroup.value.schedulePeriod?.toLowerCase();
      obj.concurrentTask = this.formGroup.value.concurrentTask;
      obj.bulletinLevel = this.formGroup.value.bulletinLevel;
    } else {
      obj = {
        id: this.flow ? this.flow.id : null,
        flowName: this.formGroup.value.flowName,
        groupId: this.formGroup.value.group,
        description: this.formGroup.value.description,
        state: this.flow ? this.flow.state : 'DISABLED',
        sourceConnectionType: this.formGroup.value.sourceType,
        sourceConnectionId: this.formGroup.value.sourceId,
        sourceConfig: JSON.stringify(sourceConf),
        sinkConnectionType: this.formGroup.value.sinkType,
        sinkConnectionId: this.formGroup.value.sinkId,
        sinkConfig: JSON.stringify(sinkConf),
        flowAdvancedConfig: this.formGroup.value.advancedConfig,
        scheduleStrategy: this.formGroup.value.scheduleStrategy,
        schedulingPeriod: this.formGroup.value.schedulePeriod?.toLowerCase(),
        concurrentTask: this.formGroup.value.concurrentTask,
        bulletinLevel: this.formGroup.value.bulletinLevel,
        isIngestion: this.valueIngestion,
        currentState: 'STOPPED'
      }
    }
    if (this.flow) {
      this.isLoading = true;
      if (this.formGroup.value.sourceType === 'HIVE') {
        this.dataIngestionService.editFlowsHive(obj).subscribe(res => {
          this.isLoading = false;
          if (res.body.responseType === 'SUCCESS') {
            this.toastrService.success(this.translate.instant('success.http.editThreadSuccess'), this.translate.instant('success.http.notify'))
            this.ref.close({message: 'close'});
          } else {
            if (res.body.errorCode === '01') {
              this.toastrService.danger(this.translate.instant('error.http.duplicateName'), this.translate.instant('error.http.errors'))
            }
          }
        }, error => {
          this.isLoading = false;
          this.toastrService.danger(error.error.message, 'Error')
        });
      } else {
        this.dataIngestionService.editFlows(obj).subscribe(res => {
          this.isLoading = false;
          if (res.body.responseType === 'SUCCESS') {
            this.toastrService.success(this.translate.instant('success.http.editThreadSuccess'), this.translate.instant('success.http.notify'))
            this.ref.close({message: 'close'});
          } else {
            if (res.body.message === '01') {
              this.toastrService.danger(this.translate.instant('error.http.duplicateName'), this.translate.instant('error.http.errors'))
            } else {
              this.toastrService.danger(res.body.message, 'Error')
            }
          }
        }, error => {
          this.isLoading = false;
          this.toastrService.danger(error.error.message, 'Error')
        });
      }

    } else {
      this.isLoading = true;
      if (this.formGroup.value.sourceType === 'HIVE') {
        this.dataIngestionService.addFlowsHIVE(obj).subscribe(res => {
          this.isLoading = false;
          if (res.body.responseType === 'SUCCESS') {
            this.toastrService.success(this.translate.instant('success.http.addThreadSuccess'), this.translate.instant('success.http.notify'))
            this.ref.close({message: 'close'});
          } else {
            if (res.body.errorCode === '01') {
              this.toastrService.danger(this.translate.instant('error.http.duplicateName'), this.translate.instant('error.http.errors'))
            } else if (res.body.errorCode === '11') {
              this.toastrService.danger(this.translate.instant('error.http.addFlow'), this.translate.instant('error.http.errors'))
            } else {
              this.toastrService.danger(res.body.errorCode, 'Error')
            }
          }
        }, error => {
          this.isLoading = false;
          this.toastrService.danger(error.error.message, 'Error')
        });
      } else {
        this.dataIngestionService.addFlows(obj).subscribe(res => {
          this.isLoading = false;
          if (res.body.responseType === 'SUCCESS') {
            this.toastrService.success(this.translate.instant('success.http.addThreadSuccess'), this.translate.instant('success.http.notify'))
            this.ref.close({message: 'close'});
          } else {
            if (res.body.message === '01') {
              this.toastrService.danger(this.translate.instant('error.http.duplicateName'), this.translate.instant('error.http.errors'))
            } else {
              this.toastrService.danger(this.translate.instant('error.http.addFlow'), this.translate.instant('error.http.errors'))
            }
          }
        }, error => {
          this.isLoading = false;
          this.toastrService.danger(error.error.message, 'Error')
        });
      }
    }
  }

  changeNumber(e) {
    return !isNaN(e.key) || e.key === 'Backspace';
  }

  changeFTP(event) {
    if (event.id) {
      this.oldSource = event;
      this.isLoading = true;
      this.dataIngestionService.getOneFtpConnection({id: event.id}).subscribe(res => {
        this.isLoading = false;
        if (res.body.results && res.body.results.length) {
          this.objectFTP = res.body.results[0];
        }
      }, error => {
        this.isLoading = false;
        this.toastrService.danger(error.error.message, 'Error')
      });
    } else {
      this.dialogService.open(NewConnectionComponent, {
        context: {
          connType: 'FTP'
        }
      }).onClose.subscribe(value => {
        if (value) {
          this.createListConnectionByFTP();
        } else {
          this.formGroup.get('sourceId').patchValue(this.oldSource.id);
        }
      });
    }
  }

  changeRDBMS(event) {
    if (event.id) {
      this.oldSource = event;
      this.isLoading = true;
      this.dataIngestionService.getOneRdbms({id: event.id}).subscribe(res => {
        this.isLoading = false;
        if (res.body.results && res.body.results.length) {
          this.objectRDBMS = res.body.results[0];
        }
      }, error => {
        this.isLoading = false;
        this.toastrService.danger(error.error.message, 'Error')
      });
    } else {
      this.dialogService.open(NewConnectionComponent, {
        context: {
          connType: 'RDBMS'
        }
      }).onClose.subscribe(value => {
        if (value) {
          this.createListConnectionByRDBMS();
        } else {
          this.formGroup.get('sourceId').patchValue(this.oldSource.id);
        }
      });
    }
  }

  changeHIVE(event) {
    if (event.id) {
      this.oldSource = event;
      this.isLoading = true;
      this.dataIngestionService.getOneHIVE({id: event.id}).subscribe(res => {
        this.isLoading = false;
        if (res.body.results && res.body.results.length) {
          this.objectHive = res.body.results[0];
        }
      }, error => {
        this.isLoading = false;
        this.toastrService.danger(error.error.message, 'Error')
      });
    } else {
      this.dialogService.open(NewConnectionComponent, {
        context: {
          connType: 'HIVE'
        }
      }).onClose.subscribe(value => {
        if (value) {
          this.createListConnectionByRDBMS();
        } else {
          this.formGroup.get('sourceId').patchValue(this.oldSource.id);
        }
      });
    }
  }

  changeHDFS(event) {
    if (event.id) {
      this.oldSink = event;
      this.isLoading = true;
      this.dataIngestionService.getOneHdfsConnection({id: event.id}).subscribe(res => {
        this.isLoading = false;
        if (res.body.results && res.body.results.length) {
          this.objectHDFS = res.body.results[0];
        }
      }, error => {
        this.isLoading = false;
        this.toastrService.danger(error.error.message, 'Error')
      });
    } else {
      this.dialogService.open(NewConnectionComponent, {
        context: {
          connType: 'HDFS'
        }
      }).onClose.subscribe(value => {
        if (value) {
          this.createListConnectionByHDFS();
        } else {
          this.formGroup.get('sinkId').patchValue(this.oldSink.id);
        }
      });
    }
  }

  changeKafka(event) {
    if (event.id) {
      this.oldSink = event;
      this.isLoading = false;
      this.dataIngestionService.getOneKafka({id: event.id}).subscribe(res => {
        this.isLoading = false;
        if (res.body.results && res.body.results.length) {
          this.objectKafka = res.body.results[0];
        }
      }, error => {
        this.isLoading = false;
        this.toastrService.danger(error.error.message, 'Error')
      });
    } else {
      this.dialogService.open(NewConnectionComponent, {
        context: {
          connType: 'Kafka'
        }
      }).onClose.subscribe(value => {
        if (value) {
          this.createListConnectionByKafka();
        } else {
          this.formGroup.get('sinkId').patchValue(this.oldSink.id);
        }
      });
    }
  }

  changeSinkFPT(event) {
    if (event.id) {
      this.oldSink = event;
      this.isLoading = false;
      this.dataIngestionService.getOneFtpConnection({id: event.id}).subscribe(res => {
        this.isLoading = false;
        if (res.body.results && res.body.results.length) {
          this.objectSinkFTP = res.body.results[0];
        }
      }, error => {
        this.isLoading = false;
        this.toastrService.danger(error.error.message, 'Error')
      });
    } else {
      this.dialogService.open(NewConnectionComponent, {
        context: {
          connType: 'FTP'
        }
      }).onClose.subscribe(value => {
        if (value) {
          this.createListConnectionBySinkFTP();
        } else {
          this.formGroup.get('sinkId').patchValue(this.oldSink.id);
        }
      });
    }
  }


  disabledButtonCreate() {
    if (this.formGroup.value.sourceType === 'FTP' && (this.formGroup.get('path').invalid || this.formGroup.get('delimiter').invalid)) {
      return true;
    }
    if (this.formGroup.get('flowName').invalid || this.formGroup.get('schedulePeriod').invalid || this.formGroup.get('concurrentTask').invalid) {
      return true;
    }
    if (this.formGroup.value.sinkType === 'HDFS' && this.formGroup.get('hdfsPath').invalid) {
      return true;
    }
    if (this.formGroup.value.sinkType === 'Kafka' && this.formGroup.get('kafkaTopics').invalid) {
      return true;
    }
    return this.isJson;
  }

  isJsonString() {
    try {
      JSON.parse(this.formGroup.value.advancedConfig);
      this.isJson = false;
    } catch (e) {
      this.isJson = true;
    }
  }

  scroll(target: HTMLElement, key: any): void {
    target.scrollIntoView({block: 'center', behavior: 'smooth'});
    this.keyChecked = key;
    console.log(key)
  }

  checkSchedule(e) {
    this.isSec = false
    if (e.target.value.endsWith(' sec')) {
      this.isSec = false
    } else if (e.target.value.endsWith(' min')) {
      this.isSec = false
    } else if (e.target.value.endsWith(' hour')) {
      this.isSec = false
    } else {
      this.isSec = true;
    }
  }
}

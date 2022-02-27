import {Component, Input, OnChanges, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ShareDataBreadcrumbService} from '../../../../services/share-data-breadcrumb.service';
import {SupportRequestService} from '../../../../services/support-request.service';
import {PopupErrorComponent} from '../../../popup-error/popup-error.component';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import {ngxCsv} from 'ngx-csv/ngx-csv';
import {AccountService} from '../../../../@core/auth/account.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'ngx-content-request',
  templateUrl: './content-request.component.html',
  styleUrls: ['./content-request.component.scss']
})
export class ContentRequestComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('confirmSendOrSaveSR') confirmSendOrSaveSR: TemplateRef<any>
  @Input() typeRequest: string;
  @Input() paramId;
  @Input() dataItems: any;
  isLoading: boolean = false;
  rpAppChecked: boolean = false;
  isValidateListUser: boolean = false;
  isValidateListReview: boolean = false;
  public subEvent: Subscription;
  keySearchUser = null;
  limits = [3, 10, 15, 20];
  limit = 3;
  fileNameUpload = '';
  userItemId: any;
  base64FileBrowser: any;
  base64FileUpload: any;
  infoEdit: any;
  listFileXlsx = [];
  lists = [];
  listAllRpApp = [];
  listUser = [];
  listUsers = [];
  listThrift = [];
  listThriftId = [];
  selectUser = [];
  listAllServer = [];
  listSrCenSorDelete = [];
  listSrUserMapDelete = [];
  listUserMapping = [];
  listUserEditMapping = [];
  listUserHanndlerNew = [];
  listUserForm: FormArray = this.fb.array([]);
  // Validators.pattern(/^([0-9][0-9][0-9][0-9],)+([0-9][0-9][0-9][0-9],)+([0-9][0-9][0-9][0-9])$/)
  formGroupInfoGroup: FormGroup = this.fb.group({
    code_SR: ['', Validators.required],
    title: ['', Validators.required],
    typeSr: [''],
    createBy: [''],
    status: [''],
    fileName: [null],
    thrift: ['', Validators.required],
    dateCreate: [''],
    dateEnd: ['', Validators.required],
    inactiveAt: ['', Validators.required],
    info: [''],
    userSendRequest: [''],
    descriptions: [''],
    userHandler: [''],
    srCensorId: [''],
    userMapping: [''],
    server: ['', Validators.required],
    port: ['', Validators.required],
    rp_app: ['', Validators.required],
    directory: ['', Validators.required],
  })
  listTypeSr = [{name: 'LB connection', key: 'lb_connection'}, {
    name: 'Thrift connection',
    key: 'thrift_connection'
  }, {name: 'Iptables ', key: 'iptables'}];
  listStatusSr = [{name: 'Waiting', key: 'waiting'}, {
    name: 'Completed',
    key: 'completed'
  }, {name: 'Rejected', key: 'rejected'}, {name: 'Invalid', key: 'invalid'}, {
    name: 'Approved',
    key: 'approved'
  }, {name: 'Archived', key: 'archived'}];
  columnsTable = [
    {name: 'STT', prop: 'stt', flexGrow: 0.5},
    {name: 'Họ và tên', prop: 'userName', flexGrow: 0.9},
    {name: 'SĐT', prop: 'phoneNumber', flexGrow: 0.9},
    {name: 'Chức vụ', prop: 'rpAppName', flexGrow: 0.9},
    {name: 'Phê duyệt', prop: 'result', flexGrow: 0.9},
    {name: 'Lý do', prop: 'reason', flexGrow: 0.9},
    {name: 'Action', prop: 'action', flexGrow: 0.8}
  ];
  rowData: any[];

  constructor(public fb: FormBuilder, private shareData: ShareDataBreadcrumbService, public router: Router, public supportRequestService: SupportRequestService, public dialogService: NbDialogService, private accountService: AccountService, private toastrService: NbToastrService) {
    this.subEvent = this.shareData.ThreadContentSR.subscribe(res => {
      if (res === 'sendSR') {
        this.dialogService.open(this.confirmSendOrSaveSR, {
          context: {title: 'send'},
          closeOnEsc: false,
          closeOnBackdropClick: false
        });
      } else if (res === 'saveSR') {
        this.dialogService.open(this.confirmSendOrSaveSR, {
          context: {title: 'save'},
          closeOnEsc: false,
          closeOnBackdropClick: false
        });
      } else if (res === 'agree') {
        this.dialogService.open(this.confirmSendOrSaveSR, {
          context: {title: 'agree'},
          closeOnEsc: false,
          closeOnBackdropClick: false
        });
      } else if (res === 'rejected') {
        this.dialogService.open(this.confirmSendOrSaveSR, {
          context: {title: 'rejected'},
          closeOnEsc: false,
          closeOnBackdropClick: false
        });
      } else {
        this.dialogService.open(this.confirmSendOrSaveSR, {
          context: {title: 'cancel'},
          closeOnEsc: false,
          closeOnBackdropClick: false
        });
      }
    });
  }

  ngOnInit(): void {
    this.getUserLogin();
    this.getAllUser();
    this.getAllLbRpApp();
    this.getListWpThrift();
    this.getListServer();
    this.listUserForm.push(this.fb.group({
      userName: [null, Validators.required],
      ipAddress: [null, Validators.required],
      groupName: ['', Validators.required],
    }));
    this.lists.push([]);
    if (this.paramId) {
      this.getListUserMapping();
      this.getAllUserBySrId();
      this.patchValueInfoSrEdit();
    } else {
      this.patchValueInfoSrAdd();
      this.rowData = [];
    }
  };

  ngOnChanges() {
    this.patchValueInfoSrEdit();
  }

  ngOnDestroy() {
    if (this.subEvent) {
      this.subEvent.unsubscribe();
    }
  }

  getUserLogin() {
    this.accountService.identity().subscribe(res => {
      const userName = res['login'];
      this.formGroupInfoGroup.get('userHandler').patchValue(userName);
    }, (error => {
      console.log('error', error)
    }));
  }

  getListWpThrift() {
    this.supportRequestService.getListWpThrift().subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.listThrift = res.body.results;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    })
  }

  getAllUser() {
    this.supportRequestService.getAllUser().subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.listUser = res.body.results;
        this.isLoading = false;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
        this.isLoading = false;
      }
    })
  }

  getAllUserBySrId() {
    const params = {
      srId: this.dataItems?.id
    }
    this.supportRequestService.getAllUserBySrId(params).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.rowData = res.body.results[0];
        this.listUsers = res.body.results[0];
        this.isLoading = false;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
        this.isLoading = false;
      }
    })
  }

  getListUserMapping() {
    this.supportRequestService.getListUserMapping(this.dataItems?.id).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.listUserMapping = res.body.results;
        this.listUserEditMapping = this.listUserMapping;
        this.isLoading = false;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
        this.isLoading = false;
      }
    })
  }

  getAllLbRpApp() {
    this.supportRequestService.getAllLbRpApp().subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.listAllRpApp = res.body.results;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    })
  }

  getListServer() {
    this.supportRequestService.getListServer().subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.listAllServer = res.body.results;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    })
  }

  getListThriftById(id) {
    const options = {
      rpAppId: id
    }
    this.supportRequestService.getListThriftById(options).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.listThrift = res.body.results;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    })
  }

  patchValueInfoSrEdit() {
    if (this.paramId) {
      const obj = JSON.parse(this.dataItems?.info);
      if (this.dataItems?.type === 'iptables') {
        this.formGroupInfoGroup.get('server').patchValue(obj['serverId']);
        this.formGroupInfoGroup.get('port').patchValue(obj['port']);
        this.formGroupInfoGroup.get('dateEnd').patchValue(obj['endAt']);
      } else if (this.dataItems?.type === 'lb_connection') {
        this.listThriftId = obj['wpThriftId'];
        this.formGroupInfoGroup.get('server').patchValue(obj['serverId']);
        this.formGroupInfoGroup.get('port').patchValue(obj['port']);
        this.formGroupInfoGroup.get('dateEnd').patchValue(obj['endAt']);
      } else {
        this.listThriftId = obj['thriftId'];
        this.formGroupInfoGroup.get('dateEnd').patchValue(obj['activeAt']);
      }
      this.formGroupInfoGroup.get('dateCreate').patchValue(this.dateFormatSR(this.dataItems?.createAt));
      this.formGroupInfoGroup.get('typeSr').patchValue(this.dataItems?.type);
      this.formGroupInfoGroup.get('status').patchValue(this.dataItems?.status);
      this.formGroupInfoGroup.get('fileName').patchValue(this.dataItems?.fileUrl);
      this.formGroupInfoGroup.get('title').patchValue(this.dataItems?.title);
      this.formGroupInfoGroup.get('code_SR').patchValue(this.dataItems?.id);
      this.formGroupInfoGroup.get('descriptions').patchValue(this.dataItems?.description);
      this.formGroupInfoGroup.get('directory').patchValue(obj['directory']);
      this.formGroupInfoGroup.get('rp_app').patchValue(obj['rpapp']);
      this.formGroupInfoGroup.get('thrift').patchValue(this.listThriftId);
      this.formGroupInfoGroup.get('inactiveAt').patchValue(obj['inactiveAt']);
      this.fileNameUpload = '';
    }
  }

  patchValueInfoSrAdd() {
    const typeSR = localStorage.getItem('typeRequest');
    const today = new Date();
    this.formGroupInfoGroup.get('typeSr').patchValue(typeSR);
    this.formGroupInfoGroup.get('dateCreate').patchValue(today);
    this.formGroupInfoGroup.get('fileName').patchValue(null);
    this.formGroupInfoGroup.get('title').patchValue('');
    this.formGroupInfoGroup.get('code_SR').patchValue('');
    this.formGroupInfoGroup.get('rp_app').patchValue(null);
    this.formGroupInfoGroup.get('thrift').patchValue(null);
    this.formGroupInfoGroup.get('server').patchValue(null);
    this.formGroupInfoGroup.get('descriptions').patchValue('');
    this.formGroupInfoGroup.get('directory').patchValue('');
    this.formGroupInfoGroup.get('dateEnd').patchValue('');
    this.formGroupInfoGroup.get('inactiveAt').patchValue('');
  }

  addRowUser(row, id) {
    const checkSameIP = this.listUserEditMapping.some((item, index) => {
      return row.value?.userName?.login === item?.userName && row.value?.ipAddress === item?.ipAddress;
    });
    if (checkSameIP === true) {
      this.toastrService.danger('Lỗi', 'Username và ipAddress đã tồn tại.');
    }
    if (row.value.userName !== null && row.value.ipAddress !== null && checkSameIP !== true) {
      if (this.paramId) {
        const arrayResole = [];
        this.listUserForm.value.map((items, index) => {
          arrayResole.push({
            userName: items?.userName?.login,
            groupName: items?.groupName,
            ipAddress: items?.ipAddress,
            srId: this.dataItems?.id
          })
        });
        this.listUserEditMapping = [...arrayResole, ...this.listUserEditMapping];
      } else {
        const arrayResole = [];
        this.listUserForm.value.map((items, index) => {
          arrayResole.push({userName: items?.userName?.login, groupName: items?.groupName, ipAddress: items?.ipAddress})
        });
        this.listUserEditMapping = [...arrayResole, ...this.listUserEditMapping];
      }
    }
    this.listUserForm.at(id).patchValue({
      userName: null,
      groupName: '',
      ipAddress: null
    });
    this.lists[id] = [];
    this.isValidateListUser = false;
  }

  deleteRowUser(row: any, index: number) {
    this.listUserEditMapping = [...this.listUserEditMapping].filter((e, indexs) => indexs !== index);
    if (this.paramId) {
      this.listSrUserMapDelete.push(row?.id);
    }
  }

  onSetValueGroup(row: any, index: number) {
    if (row.value.userName === null) {
      this.listUserForm.at(index).patchValue({
        groupName: '',
        ipAddress: null
      });
      this.lists[index] = [];
    } else {
      this.userItemId = row.value.userName?.id;
      const optionParams = {
        userId: this.userItemId
      }
      this.supportRequestService.getWpUserIp(optionParams).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          this.lists[index] = res.body.results;
        } else {
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.body.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
        }
      });
      this.supportRequestService.getWp(row.value.userName?.groupId).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          const groupName = res.body.results[0].name;
          this.listUserForm.at(index).patchValue({
            groupName: groupName,
          });
        } else {
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.body.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
        }
      })
    }
  }

  toggleRpApp(event: boolean) {
    this.rpAppChecked = event;
    if (this.rpAppChecked) {
      console.log('0')
    } else {
      console.log('1')
    }
  }

  onFileChange(event: any) {
    let files
    files = event.target['files'][0];
    this.base64FileBrowser = files;
    this.formGroupInfoGroup.get('fileName').patchValue(files.name);
  }

  onFileChangeUpload(event: any) {
    let file;
    file = event.target['files'][0];
    this.base64FileUpload = file;
    this.fileNameUpload = file.name;
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (events) => {
      const binaryData = events.target?.result;
      const workBook = XLSX.read(binaryData, {type: 'binary'});
      workBook.SheetNames.forEach((sheet) => {
        const data: any = XLSX.utils.sheet_to_json(workBook.Sheets[sheet]);
        console.log(data);
        this.listFileXlsx = data;
        this.listUserEditMapping = this.listFileXlsx;
      });
    };
    this.isValidateListUser = false;
  }

  clearFileName() {
    this.formGroupInfoGroup.get('fileName').patchValue(null);
  };

  addUserSR(event) {
    const checkSameUser = this.listUserHanndlerNew.some((value, index) => {
      return event?.login === value?.login
    });
    if (checkSameUser !== true) {
      this.listUserHanndlerNew.push(event);
      if (event) {
        const arrayIdAdd = [event];
        this.rowData = [...this.rowData].concat(arrayIdAdd);
      }
    }
    this.isValidateListReview = false;
  }

  deleteUserSR(userId: number) {
    this.rowData = [...this.rowData].filter(v => v.id !== userId);
    const arrayId = [];
    arrayId.push(userId);
    this.listSrCenSorDelete = [...this.listSrCenSorDelete].concat(arrayId);
  }

  dateFormatSR(date) {
    const dateInputs = new Date(date);
    const dateStringOutPut = dateInputs.getFullYear() + '-' +
      ('0' + (dateInputs.getMonth() + 1)).slice(-2) + '-' +
      ('0' + dateInputs.getDate()).slice(-2) + ' ' +
      ('0' + dateInputs.getHours()).slice(-2) + ':' +
      ('0' + dateInputs.getMinutes()).slice(-2) + ':' +
      ('0' + dateInputs.getSeconds()).slice(-2)
    return dateStringOutPut
  }

  sendSR(ref, key) {
    const listUserHandle = [...this.rowData].map((value) => {
      return value?.id
    });
    const listUserHandleNew = [...this.listUserHanndlerNew].map((value) => {
      return value?.id
    });
    if (this.paramId) {
      if (this.rowData.length !== 0 && this.listUserEditMapping.length !== 0 || this.fileNameUpload !== '') {
        if (this.dataItems?.type === 'thrift_connection') {
          const infoEdit = {
            thriftId: this.formGroupInfoGroup.value.thrift,
            inactiveAt: this.dateFormatSR(this.formGroupInfoGroup.value.inactiveAt),
            activeAt: this.dateFormatSR(this.formGroupInfoGroup.value.dateEnd)
          };
          this.infoEdit = JSON.stringify(infoEdit)
        } else if (this.dataItems?.type === 'iptables') {
          const infoEdit = {
            serverId: this.formGroupInfoGroup.value.server,
            port: this.formGroupInfoGroup.value.port,
            endAt: this.dateFormatSR(this.formGroupInfoGroup.value.dateEnd)
          };
          this.infoEdit = JSON.stringify(infoEdit)
        } else {
          if (this.rpAppChecked === false) {
            const infoEdit = {
              isNewRpApp: 0,
              rpapp: this.formGroupInfoGroup.value.rp_app,
              wpThriftId: this.formGroupInfoGroup.value.thrift,
              endAt: this.dateFormatSR(this.formGroupInfoGroup.value.dateEnd)
            };
            this.infoEdit = JSON.stringify(infoEdit)
          } else {
            const infoEdits = {
              isNewRpApp: 1,
              rpapp: this.formGroupInfoGroup.value.rp_app,
              wpThriftId: this.formGroupInfoGroup.value.thrift,
              endAt: this.dateFormatSR(this.formGroupInfoGroup.value.dateEnd),
              serverId: 1,
              directory: this.formGroupInfoGroup.value.directory,
            };
            this.infoEdit = JSON.stringify(infoEdits)
          }
        }
        const formData = new FormData();
        formData.append('id', this.dataItems?.id);
        formData.append('title', this.formGroupInfoGroup.value.title);
        formData.append('type', this.formGroupInfoGroup.value.typeSr);
        formData.append('info', this.infoEdit);
        formData.append('fileUpload', this.base64FileUpload);
        formData.append('listUserHandler', listUserHandleNew.toString());
        formData.append('createAtString', this.dateFormatSR(this.formGroupInfoGroup.value.dateCreate));
        formData.append('description', this.formGroupInfoGroup.value.descriptions);
        if (this.formGroupInfoGroup.value.fileName !== null) {
          formData.append('fileUrl', this.formGroupInfoGroup.value.fileName);
        }
        if (key === 'update') {
          formData.append('listSrCenSorDelete', this.listSrCenSorDelete.toString());
          formData.append('listSrUserMapDelete', this.listSrUserMapDelete.toString());
          formData.append('status', 'archived');
          if (this.dataItems?.fileListUser !== 'null') {
            formData.append('fileListUser', this.dataItems?.fileListUser)
          }
          if (this.fileNameUpload === '') {
            formData.append('listUserMapping', JSON.stringify(this.listUserEditMapping));
          } else {
            const b = this.listUserForm.value.map((value, keys) => {
              return {...value, srId: this.dataItems?.id}
            })
            formData.append('fileUpload', this.base64FileUpload);
            formData.append('listUserMapping', JSON.stringify(b));
          }
        } else {
          if (this.fileNameUpload === '') {
            formData.append('listUserMapping', JSON.stringify(this.listUserEditMapping));
          } else {
            formData.append('fileUpload', this.base64FileUpload);
          }
          formData.append('browserFile', this.base64FileBrowser);
          formData.append('status', 'waiting');
        }
        this.isLoading = true;
        this.supportRequestService.updateSr(formData).subscribe(res => {
          if (res.body.responseType === 'SUCCESS') {
            this.toastrService.success('Success', 'Thông báo');
            this.shareData.callSRById('');
            this.isLoading = false;
            ref.close();
          } else {
            this.toastrService.danger('Fail', 'Thông báo');
            ref.close();
            this.isLoading = false;
          }
        }, () => {
          this.isLoading = false;
        })
      } else {
        this.toastrService.danger('Fail', 'Thêm đủ thông tin trước khi thực hiện.');
        if (this.rowData.length === 0 && this.listUserEditMapping.length === 0) {
          this.isValidateListReview = true;
          this.isValidateListUser = true;
        } else if (this.listUserEditMapping.length === 0) {
          this.isValidateListUser = true;
        } else if (this.rowData.length === 0) {
          this.isValidateListReview = true;
        } else {
          console.log('validate')
        }
        ref.close();
      }
    } else {
      if (this.rowData.length !== 0 && this.listUserEditMapping.length !== 0 || this.fileNameUpload !== '') {
        const typeRequest = localStorage.getItem('typeRequest');
        if (typeRequest === 'thrift_connection') {
          const infoEdit = {
            thriftId: this.formGroupInfoGroup.value.thrift,
            inactiveAt: this.formGroupInfoGroup.value.inactiveAt !== '' ? this.dateFormatSR(this.formGroupInfoGroup.value.inactiveAt) : '',
            activeAt: this.formGroupInfoGroup.value.dateEnd !== '' ? this.dateFormatSR(this.formGroupInfoGroup.value.dateEnd) : ''
          };
          this.infoEdit = JSON.stringify(infoEdit)
        } else if (typeRequest === 'iptables') {
          const infoEdit = {
            serverId: this.formGroupInfoGroup.value.server,
            port: this.formGroupInfoGroup.value.port,
            endAt: this.formGroupInfoGroup.value.dateEnd !== '' ? this.dateFormatSR(this.formGroupInfoGroup.value.dateEnd) : ''
          };
          this.infoEdit = JSON.stringify(infoEdit)
        } else {
          if (this.rpAppChecked === false) {
            const infoEdit = {
              isNewRpApp: 0,
              rpapp: this.formGroupInfoGroup.value.rp_app,
              wpThriftId: this.formGroupInfoGroup.value.thrift,
              endAt: this.formGroupInfoGroup.value.dateEnd !== '' ? this.dateFormatSR(this.formGroupInfoGroup.value.dateEnd) : ''
            };
            this.infoEdit = JSON.stringify(infoEdit)
          } else {
            const infoEdits = {
              isNewRpApp: 1,
              rpapp: this.formGroupInfoGroup.value.rp_app,
              wpThriftId: this.formGroupInfoGroup.value.thrift,
              endAt: this.formGroupInfoGroup.value.dateEnd !== '' ? this.dateFormatSR(this.formGroupInfoGroup.value.dateEnd) : '',
              serverId: 1,
              directory: this.formGroupInfoGroup.value.directory,
            };
            this.infoEdit = JSON.stringify(infoEdits)
          }
        }
        const formData = new FormData();
        formData.append('title', this.formGroupInfoGroup.value.title);
        formData.append('type', this.formGroupInfoGroup.value.typeSr);
        formData.append('fileUrl', this.formGroupInfoGroup.value.fileName);
        formData.append('info', this.infoEdit);
        formData.append('browserFile', this.base64FileBrowser);
        formData.append('listUserHandler', listUserHandle.toString());
        formData.append('createAtString', this.dateFormatSR(this.formGroupInfoGroup.value.dateCreate));
        formData.append('description', this.formGroupInfoGroup.value.descriptions);
        if (this.fileNameUpload === '') {
          formData.append('listUserMapping', JSON.stringify(this.listUserEditMapping));
        } else {
          formData.append('fileUpload', this.base64FileUpload);
        }
        if (key === 'update') {
          formData.append('status', 'archived');
        } else {
          formData.append('status', 'waiting');
        }
        this.isLoading = true;
        this.supportRequestService.createOrSaveSr(formData).subscribe(res => {
          if (res.body.responseType === 'SUCCESS') {
            this.toastrService.success('Success', 'Thông báo');
            this.router.navigate(['/page/support-request']);
            ref.close();
            this.isLoading = false;
          } else {
            this.toastrService.danger('Fail', 'Thông báo');
            ref.close();
            this.isLoading = false;
          }
        }, () => {
          this.isLoading = false;
        })
      } else {
        this.toastrService.danger('Fail', 'Thêm đủ thông tin trước khi thực hiện.');
        if (this.rowData.length === 0 && this.listUserEditMapping.length === 0) {
          this.isValidateListReview = true;
          this.isValidateListUser = true;
        } else if (this.listUserEditMapping.length === 0) {
          this.isValidateListUser = true;
        } else if (this.rowData.length === 0) {
          this.isValidateListReview = true;
        } else {
          console.log('validate')
        }
        ref.close();
      }
    }
  }

  cancelSR(ref) {
    this.router.navigate(['/page/support-request']);
    ref.close();
  }

  clearFileUpload() {
    this.fileNameUpload = '';
    this.dataItems['fileListUser'] = '';
    this.listFileXlsx = [];
    this.listUserEditMapping = [];
  }

  downloadFile() {
    this.supportRequestService
      .downloadFile(this.dataItems?.fileListUser)
      .subscribe((res) => {
        console.log(res);
        const blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        fileSaver.saveAs(blob, this.dataItems?.fileListUser);
      });
  }

  updateResult(ref: any, key) {
    this.isLoading = true;
    const options = {
      srId: this.dataItems?.id,
      result: key
    }
    this.supportRequestService.updateResult(options).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success(res.body.message, 'Thông báo');
        this.shareData.callSRById('');
        this.getAllUserBySrId();
        ref.close();
        this.isLoading = false;
      } else {
        this.toastrService.danger('Fail', 'Thông báo');
        ref.close();
        this.isLoading = false;
      }
    }, () => {
      this.isLoading = false;
    })
  }

  changeThriftByRpApp() {
    this.getListThriftById(this.formGroupInfoGroup.value.rp_app);
    this.formGroupInfoGroup.get('thrift').patchValue('');
  }

  portValidate(e) {
    return !isNaN(e.key) || e.key === 'Backspace' || e.key === ','
  }
}

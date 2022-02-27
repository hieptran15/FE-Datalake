import {Component, OnInit, ViewChild} from '@angular/core';
import {SendRequireComponent} from '../access-management/send-require/send-require.component';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {NgSelectComponent} from '@ng-select/ng-select';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Page} from '../../@core/model/page.model';
import {AuthoritiesConstant} from '../../authorities.constant';
import {AccessManagementService} from '../../@core/mock/access-management.service';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';

import {AddOrEditAppComponent} from '../access-management/add-or-edit-app/add-or-edit-app.component';
import {IpTableRuleService} from '../../services/ip-table-rule.service';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {PopupErrorComponent} from '../popup-error/popup-error.component';
// import {IptableRuleService} from '../../services/iptable-rule.service';

// import {AddOrEditAppComponent} from "../iptable-rule/add-or-edit-app/add-or-edit-app.component";

@Component({
  selector: 'ngx-iptable-rule',
  templateUrl: './iptable-rule.component.html',
  styleUrls: ['./iptable-rule.component.scss']
})
export class IptableRuleComponent implements OnInit {


  @ViewChild('treemenu')
  public treeContextMenu: any;
  @ViewChild(SendRequireComponent) sendRequireComponent: any;
  @ViewChild(DatatableComponent) public table: DatatableComponent;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;

  columns = [
    {name: 'Mail', prop: 'ipAddress', flexGrow: 0.8},
    {name: 'Ứng dụng', prop: 'rpAppName', flexGrow: 1.2},
    {name: 'Team', prop: 'team', flexGrow: 0.6},
    {name: 'Bắt đầu', prop: 'startTime', flexGrow: 1},
    {name: 'Kết thúc', prop: 'endTime', flexGrow: 1},
    {name: 'Trạng thái', prop: 'status', flexGrow: 1}
  ];
  columnsTable = [
    {name: 'Index', prop: 'id', flexGrow: 0.5},
    {name: 'Người dùng', prop: 'userName', flexGrow: 0.9},
    {name: 'Ip', prop: 'ipAddress', flexGrow: 0.9},
    {name: 'Server', prop: 'smServerIp', flexGrow: 0.9},
    {name: 'Port', prop: 'port', flexGrow: 0.9},
    {name: 'File', prop: 'fileName', flexGrow: 0.9},
    {name: 'Trạng thái ', prop: 'status', flexGrow: 0.6},
    {name: 'Action', prop: 'action', flexGrow: 0.8}
  ];

  // luu tam row data
  dataCache: any;
  rowData = []
  currentTheme: any = 'dark';
  currentAppId;
  public currentVisible: number = 0;
  checkDate: boolean = false;
  dataApp: any;
  dataDetail: any = {};
  dataTable = [];
  defaultStatus;
  dateCreate: any;
  dateEnd: any;
  defaultFilterTable;
  filterTable;
  limits = [5, 10, 15, 20];
  limit = 10;
  rows = [];
  selectRowWhenEdit = {};
  browserFileButton: boolean;
  isFilerBox: boolean = false;
  UserIptableRule = [];
  ServerIptableRule = [];
  StatusIptableRule = [{id: 1, value: 'Active'}, {id: 0, value: 'Lock'}];
  UIDtableRule = [];

  formGroupIpRule: FormGroup = this.fb.group({
    User: [null],
    Type: [null],
    Server: [null],
    Port: [null],
    dateStart: [null],
    dateEnd: [null],
    Status: [null],
    notification: [null],
    Ip: [null],
    file: [null, [Validators.required]],
  })
  formGroup: FormGroup = this.fb.group({
    accessStatus: [null],
    accessSearch: [null],
    accessCluster: [null],
  });
  public items: any[] = [{text: 'Thay đổi thông tin', icon: 'edit'}];
  listApp;
  isLoading: boolean;
  objectSearch;
  page = new Page();
  selected = [];
  status = [{name: 'All', value: '00'}, {name: 'Người dùng', value: '01'}, {name: 'Server', value: '02'}, {
    name: 'Status',
    value: '03'
  }, {
    name: 'Ip',
    value: '04'
  }];
  textSearch = '';
  authority = AuthoritiesConstant;
  private contextItem: any;
  private base64File: any;
  private fileNameOld: any;

  constructor(
    private accessManagementService: AccessManagementService,
    public translate: TranslateService,
    private fb: FormBuilder,
    public dialogService: NbDialogService,
    private toastrService: NbToastrService,
    public IptableService: IpTableRuleService,
    private shareData: ShareDataBreadcrumbService
  ) {
    this.singleSelectCheck = this.singleSelectCheck.bind(this);
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.doSearch('', '');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.rowData = this.rowData.sort((a: any, b: any) => {
      if (a.smServerIp >= b.smServerIp) return 1;
      else if (a.smServerIp <= b.smServerIp) return -1;
      else return 0;
    });

    this.browserFileButton = true;
    this.sendDataTest();

    this.defaultStatus = '00';
    // this.search(null, 2, null, 0);
    this.loadCluster();

    console.log(this.rowData);


  }

  doSearch(text: string, type: any): void {
    this.isLoading = true;
    this.IptableService.doSearch(text, type).subscribe(res => {

        if (res.body.responseType === 'SUCCESS') {
          this.isLoading = false;
          const data = res.body.results[0];
          this.rows = this.rowData;
          this.rowData = data;
          console.log(this.rowData);
        } else {
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.body.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
          this.isLoading = false;
        }
      }

      , (
        error
      ) => {
        this
          .dialogService
          .open(PopupErrorComponent, {
            context: {error: error},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })

        this
          .isLoading = false;
      }
    )
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Access manager',
      groupText: 'Server manager',
      titleChild: 'Iptables rule',
      urlPage: '/page/iptable-rule'
    })
  }

  singleSelectCheck(row
                      :
                      any
  ) {
    this.dataDetail = row;
    return this.selected.indexOf(row) === -1;
  }

  loadCluster() {
    this.accessManagementService.getListCluster().subscribe(res => {
      if (res) {
        this.filterTable = res.results;
        if (this.filterTable && this.filterTable.length > 0) {
          this.defaultFilterTable = this.filterTable[0].id;
        }
      }
    });
  }

  loadApp() {
    const obj = {ClusterId: this.defaultFilterTable};
    this.accessManagementService.gitListApp(obj).subscribe(res => {
      this.dataApp = this.generateTreeApp(res.body.results, null);
      this.listApp = res.body.results;
      this.sendRequireComponent.setListAppParent(this.listApp);
    });
  }

  generateTreeApp(data, parent) {
    const nestedTreeStruct = [];
    const length = data.length;
    for (let i = 0; i < length; i++) {
      const model = data[i];
      if (parent) {
        if (+model['rpAppId'] === +parent) {
          const children = this.generateTreeApp(data, model['appId']);
          if (children.length > 0) {
            model.children = children;
          }
          nestedTreeStruct.push(model);
        }
      } else {
        if (!model['rpAppId']) {
          const children = this.generateTreeApp(data, model['appId']);
          if (children.length > 0) {
            model.children = children;
          }
          nestedTreeStruct.push(model);
        }
      }
    }
    return nestedTreeStruct;
  }


  clearFileName() {
    this.formGroupIpRule.controls['file'].reset();
    this.formGroupIpRule.controls['file'].setValue('');
    console.log(this.formGroupIpRule.controls['file'].value);
    this.browserFileButton = true;
  }

  onFileChange(event
                 :
                 Event
  ) {
    let file
    file = event.target['files'][0];
    this.base64File = file;
    this.formGroupIpRule.controls['file'].setValue(file.name);


    this.browserFileButton = false;
  }

  changeDetails(event) {
    this.currentAppId = event.dataItem.rpAppId ? event.dataItem.rpAppId : event.dataItem.appId;
    console.log('event', this.currentAppId);
    this.isLoading = true;
    // this.search(this.currentAppId, null, null, 0);
  }

  openDialog() {
    this.dialogService.open(AddOrEditAppComponent,
      {
        context: {
          listApp: this.listApp,
          listCluster: this.filterTable,
        },
        closeOnBackdropClick: false
      }).onClose.subscribe(value => {
      if (value) {
        this.loadApp();
      }
    });
  }

  public

  onNodeClick(e
                :
                any
  ):
    void {
    if (e.type === 'contextmenu'
    ) {
      const originalEvent = e.originalEvent;

      originalEvent.preventDefault();

      this.contextItem = e.item.dataItem;

      this.treeContextMenu.show({left: originalEvent.pageX, top: originalEvent.pageY});
    }
  }

  updateDialog(template, row, status) {
    const value = {
      acId: row.acId,
      status: status
    }
    this.dialogService.open(template, {context: {...row, status: status}});
  }

  updateAuthConnection(data, ref) {
    this.isLoading = true;
    this.accessManagementService.updateAuthConnection(data).subscribe(res => {
      this.isLoading = false;
      this.toastrService.success('Cập nhật bản ghi thành công', 'Thông báo');
      ref.close();

    }, error => {
      this.isLoading = false;
      this.toastrService.danger('Cập nhật thất bại', 'Thông báo');
      ref.close();
    });
  }

  onSelect(event) {
    console.log('right click', event, this.contextItem);
    this.dialogService.open(AddOrEditAppComponent,
      {
        context: {
          appData: this.contextItem,
          isEddit: true,
          listApp: this.listApp,
          listCluster: this.filterTable,
          app: this.contextItem.rpAppId ? false : true,
        }
      }).onClose.subscribe(res => {
      if (res) {
        this.loadApp();
      }
    });
  }

  getTotalPage(rowCount, pageSize) {
    return Math.ceil(rowCount / pageSize);
  }

  formatDateCheck(date) {
    if (date) {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;

      return [year, month, day].join('-');
    } else {
      return ''
    }
  }

  addOrEditConnection(title: string, ref: any) {

    console.log(this.selectRowWhenEdit);
    if (title.toLowerCase() === 'add') {
      const moketnoi = {
        User: this.formGroupIpRule.controls['User'].value,
        Ip: this.formGroupIpRule.controls['Ip'].value,
        // dateStart : this.formGroupIpRule.controls['dateStart'].value,
        dateEnd: this.formGroupIpRule.controls['dateEnd'].value,
        file: this.formGroupIpRule.controls['file'].value,
        notification: this.formGroupIpRule.controls['notification'].value,
        Port: this.formGroupIpRule.controls['Port'].value,
        Server: this.formGroupIpRule.controls['Server'].value,
      }

      const formdata = new FormData();
      formdata.append('userId', this.formGroupIpRule.controls['User'].value);
      formdata.append('ipAddress', this.formGroupIpRule.controls['Ip'].value?.ipAddress);
      formdata.append('wpUserId', this.formGroupIpRule.controls['Ip'].value.id);
      formdata.append('serverId', this.formGroupIpRule.controls['Server'].value?.id);
      formdata.append('smServerIp', this.formGroupIpRule.controls['Server'].value?.ip);
      formdata.append('userLogin', this.formGroupIpRule.controls['Server'].value?.userSsh);
      formdata.append('passLogin', this.formGroupIpRule.controls['Server'].value?.passSsh);
      formdata.append('passRoot', this.formGroupIpRule.controls['Server'].value?.passRoot);
      formdata.append('port', this.formGroupIpRule.controls['Port'].value);
      formdata.append('endTime', this.dateFormat(this.formGroupIpRule.controls['dateEnd'].value));
      formdata.append('type', '0');
      formdata.append('reason', this.formGroupIpRule.controls['notification'].value);
      formdata.append('multipartFile', this.base64File);
      formdata.append('status', '1');
      // console.log('mo ket noi ', moketnoi);
      formdata.forEach(element => {
        console.log('formdata:', element);
      })
      this.IptableService.save(formdata).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          // console.log(res);
          this.doSearch('', '');
          this.toastrService.success('Success', this.translate.instant('toast.note'));
          this.isLoading = false;
          ref.close();
        } else {
          this.toastrService.danger('Fail', this.translate.instant('toast.note'));
          ref.close();
        }
      }, (error) => {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error},
          closeOnEsc: false,
          closeOnBackdropClick: false

        })
        this.isLoading = false;
        ref.close();
      })
    } else if (title.toLowerCase() === 'edit') {

      console.log('data : ', this.dataCache);
      const formDataUpdate = new FormData();
      formDataUpdate.append('userId', this.dataCache.userId);
      formDataUpdate.append('wpUserId', this.dataCache.wpUserId);
      formDataUpdate.append('serverId', this.dataCache.serverId);
      formDataUpdate.append('smServerIp', this.dataCache.smServerIp);
      formDataUpdate.append('passRoot', this.dataCache.passRoot);
      formDataUpdate.append('port', this.formGroupIpRule.controls['Port'].value);
      formDataUpdate.append('endTime', this.dateFormat(this.formGroupIpRule.controls['dateEnd'].value));
      formDataUpdate.append('reason', this.formGroupIpRule.controls['notification'].value);
      // formDataUpdate.append('multipartFile', this.base64File);
      // formDataUpdate.append('endTime', this.dateFormat(this.dataCache.endDate));
      // formDataUpdate.append('id', this.dataCache.id);
      formDataUpdate.append('fileName', this.formGroupIpRule.controls['file'].value);
      formDataUpdate.append('status', this.formGroupIpRule.value.Status);

      if (this.fileNameOld === this.formGroupIpRule.value.file) {
      } else {
        formDataUpdate.append('multipartFile', this.base64File);

      }

      console.log(this.dateFormat(this.formGroupIpRule.controls['dateEnd'].value));
      // console.log(this.formGroupIpRule.controls['dateEnd'].value);
      this.IptableService.update(formDataUpdate, this.dataCache.id).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          console.log(res);
          this.doSearch('', '');
          this.toastrService.success('Success', this.translate.instant('toast.note'));
          this.isLoading = false;
          ref.close();
        } else {
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.body.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
          this.isLoading = false;
          ref.close();
        }
      }, (error) => {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
        this.isLoading = false;
        ref.close();
      })


    }
  }

  dateFormat(date) {
    const dateInput = new Date(date);
    const dateStringOutPut = dateInput.getFullYear() + '-' +
      ('0' + (dateInput.getMonth() + 1)).slice(-2) + '-' +
      ('0' + dateInput.getDate()).slice(-2) + ' ' +
      ('0' + dateInput.getHours()).slice(-2) + ':' +
      ('0' + dateInput.getMinutes()).slice(-2) + ':' +
      ('0' + dateInput.getSeconds()).slice(-2)
    return dateStringOutPut
  }

  getRowDataTable(row
                    :
                    any
  ) {
    this.fileNameOld = this.dataCache.fileName;
    const date1 = new Date('2020-06-24 22:57:36');

    console.log(row);
    console.log(row.endAt);
    console.log(row.endTime);
    this.formGroupIpRule.controls['User'].setValue(row.userId);

    this.formGroupIpRule.controls['Ip'].setValue(row.ipAddress);
    this.formGroupIpRule.controls['dateEnd'].setValue(this.dateFormat(row.endAt));
    this.formGroupIpRule.controls['dateStart'].setValue(this.dateFormat(row.endAt));

    this.formGroupIpRule.controls['file'].setValue(row.fileName);
    this.browserFileButton = false;
    this.formGroupIpRule.controls['notification'].setValue(this.dataCache.reason);
    this.formGroupIpRule.controls['Port'].setValue(row.port);
    this.formGroupIpRule.controls['Server'].setValue(row.smServerIp);

    if (row.type === 0) {
      this.formGroupIpRule.controls['Type'].setValue('Thủ công ');
    } else {
      this.formGroupIpRule.controls['Type'].setValue('Tự công ');

    }


    // this.formGroupIpRule.controls['Type'].disable();
    // this.formGroupIpRule.controls['Server'].disable();
    // this.formGroupIpRule.controls['User'].disable();
    this.formGroupIpRule.controls['dateStart'].disable();
    if (row.status === 0)
      this.formGroupIpRule.controls['Status'].setValue(0);
    else if (row.status === 1)
      this.formGroupIpRule.controls['Status'].setValue(1);
    else
      this.formGroupIpRule.controls['Status'].setValue(0);

  }

  filterWithID()
    :
    void {
    this.doSearch(this.textSearch, this.defaultStatus);
  }


  PortIptableRule: any;

  OpenAddConect()
    :
    void {
    this.formGroupIpRule.controls['Type'].enable();
    this.formGroupIpRule.controls['Server'].enable();
    this.formGroupIpRule.controls['User'].enable();
    this.formGroupIpRule.controls['dateStart'].enable();
    this.checkDate = false;
    this.browserFileButton = true;
    this.formGroupIpRule.reset();

  }

  lockOrUnlock(ref) {
    let status
    if (this.dataCache.status === 0) {
      status = 1;
    }
    if (this.dataCache.status === 1) {
      status = 0;
    } else {
      status = 1;
    }
    this.IptableService.updateStatus(status, this.dataCache.id).subscribe((res) => {
      console.log(res);
      if (res.responseType === 'SUCCESS') {
        this.toastrService.success('Success', this.translate.instant('toast.note'));
        this.doSearch(this.textSearch, this.defaultStatus);
        ref.close();
      } else {
        this.toastrService.danger('Fail', this.translate.instant('toast.note'));
        ref.close();
      }
    })
  }

  searchWithSelect()
    :
    void {

    this.doSearch(this.textSearch, this.defaultStatus);
  }


  wpUserIp(data
             :
             any
  ) {

    this.IptableService.getUserIP(data).subscribe(res => {
      console.log(res);
      this.UIDtableRule = res.body.results;
    });
  }


  getListUser() {
    this.IptableService.getAllUser().subscribe(res => {
      console.log(res);
      this.UserIptableRule = res.body.results;
    })
  }


  getPort() {
    this.IptableService.getPort().subscribe(res => {
      console.log(res);
      // this.PortIptableRule = res.body.results[0];
      console.log('data:', this.PortIptableRule);
      this.PortIptableRule = res.body.results.filter(x => x.port !== null)
      console.log(this.PortIptableRule);
    })
  }


  getServer() {
    this.IptableService.getServer().subscribe(res => {
      console.log(res);
      this.ServerIptableRule = res.body.results;
    })
  }

  OpenPopup(form
              :
              any, text
              :
              string
  ):
    void {
    // this.wpUserIp(null);
    this.isFilerBox = false;
    this.getListUser();
    this.getPort();
    this.getServer();
    this.dialogService.open(form, {context: {title: text}, closeOnBackdropClick: false})
  }

  changeUser(event) {
    this.wpUserIp(event)
    // this.formGroupLB.get('user').valueChanges.subscribe(value => {
    //   console.log(value)
    // });
  }

  // filter
  openBoxFiler() {
    this.isFilerBox = !this.isFilerBox;
  }

  closePupupFilter() {
    this.isFilerBox = false;
    this.defaultStatus = '00';
    this.doSearch(this.textSearch, this.defaultStatus);
  }
  closePupup() {
    this.isFilerBox = false;
  }
}

